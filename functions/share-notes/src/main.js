import { Databases, Permission, Role ,Client } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
     .setKey(process.env.APPWRITE_API_KEY);

  const databases =  new Databases(client);


  databases.getDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId)
  .then((response)=>{
    let perms = response.$permissions;

    log(perms)
    
    const role = Role.user(req.query.userId);
    perms = [...perms,Permission.read(role),Permission.update(role)]

    log(perms)

    return res.json({perms:perms});
    
    databases.updateDocument(process.env.VITE_DATABASE_ID,process.env.VITE_NOTES_COLLECTION_ID,req.query.noteId,response.data,perms)
    .then((res)=>{

    })
    .catch(()=>{

    })
  })
  .catch(()=>{
    return res.json({error:true});
  })


  // // The `req` object contains the request data
  // if (req.method === 'GET') {
  //   return res.send('Hello, World!');
  // }

  // // `res.json()` is a handy helper for sending JSON
  // return res.json({
  //   motto: 'Build like a team of hundreds_',
  //   learn: 'https://appwrite.io/docs',
  //   connect: 'https://appwrite.io/discord',
  //   getInspired: 'https://builtwith.appwrite.io',
  // });
};
