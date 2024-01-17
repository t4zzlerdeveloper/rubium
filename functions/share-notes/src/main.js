import { Avatars,Query, Databases, Permission, Role ,Client,Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
     .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);
  const avatars = new Avatars(client);

  try{
    const response = await users.list([Query.equal("email", [req.query.email])]);
    
    if(response.total !== 1){
      return res.json({success:false})
    }
    
    return res.json({
      $id: response.users[0].$id,
      email: response.users[0].email,
      avatar: await avatars.getInitials(response.users[0].name)
    })  
   
  }
  catch(err){
    error(err)
  }

  //add auth
  return res.send("Temporarily disabled until fully developed")

  if(req.method == "POST"){
    try{
      const response = await databases.getDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId)
     
      let perms = response.$permissions;
       
       const role = Role.user(req.query.userId);
       perms = [...perms,Permission.read(role)]
       perms = [...perms,Permission.update(role)]
   
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
  else if(req.method == "DELETE"){

    try{
      const response = await databases.getDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId)
     
      let perms = response.$permissions;
       
       const role = Role.user(req.query.userId);

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
