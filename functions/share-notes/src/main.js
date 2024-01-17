import { Avatars,Query, Databases, Permission, Role ,Client,Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
     .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);
  const avatars = new Avatars(client);

  async function getUserIdByEmail(email){
    try{
      const response = await users.list([Query.equal("email", [email])]);
      
      if(response.total !== 1){
        return null;
      }
  
      return response.users[0].$id;
     
    }
    catch(err){
      error(err)
      return null;
    }
  }

  async function validateSession(userId,sessionId){
    try{
      const response = await users.listSessions(userId)
      let authed = false;
      response.sessions.map((ss)=>{
        if(ss.$id == sessionId){
          authed = true;
        }
      })

      return authed;
     
    }
    catch(err){
      error(err)
      return false;
    }
    
  }


  if(req.method == "POST"){
    try{
      const response = await databases.getDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.body.noteId)

      let perms = response.$permissions;

    
      const userId = await getUserIdByEmail(req.body.email);
      const isOwner = perms.includes(Permission.delete(Role.user(req.body.ownerId)));
      const authed = await validateSession(req.body.ownerId,req.body.sessionId);


      if(!isOwner || !authed || userId == null){
          return res.json({success:false,debug:"err2"})
      }

      const role = Role.user(userId);
      perms = [...perms,Permission.read(role)]
      perms = [...perms,Permission.update(role)]

      try{
        const response2 = databases.updateDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.body.noteId,response.data,perms)
        return res.json({success:true});
      }
      catch(err){
        error(err)
        return res.json({success:false,debug:"err3"});
      } 

    }
    catch(err){
      error(err)
      return res.json({success:false,debug:"err4"});
    }
  }
  else if(req.method == "DELETE"){

    try{
      const response = await databases.getDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId)
     
      let perms = response.$permissions;
       
      const userId = await getUserIdByEmail(req.query.email);
      const isOwner = !perms.includes(Permission.delete(Role.user(req.query.authId)));
      
      if(!isOwner || userId == null){
        return res.json({success:false/*,debug:"Auth owner error uId: " + userId */})
      }

      const role = Role.user(userId);
      permissions = permissions.filter(function(e) {
        return e !== Permission.read(role) && e !==Permission.update(role);
      });
   
       try{
         const response2 = databases.updateDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId,response.data,perms)
         return res.json({success:true});
       }
       catch(err){
         error(err)
         return res.json({success:false});
       }
       
     }
     catch(err){
       error(err)
     }

  }
  
};
