import { useEffect, useState } from 'react';
import './ShareDialog.css'

import { databases } from '../../lib/appwrite'
import { useUser } from '../../lib/context/user';

import removePerson from '../../assets/person_remove.svg'
import closeIcon from '../../assets/close.svg'
import { Permission, Role } from 'appwrite';

function ShareDialog(props){

    const [confirmed,setConfirmed] = useState(false);
    const [email,setEmail] = useState("");

    const user = useUser();

    useEffect(()=>{
        if(props.display) setConfirmed(false);
    },[props.display])

    useEffect(()=>{
        if(props.noteId) fetchNote();
    },[props.noteId])

    const [note,setNote] = useState(null);

    function fetchNote(){
        databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,props.noteId)
        .then((res)=>{
            setNote(res);
            setIsPublished(note.$permissions.includes(Permission.read(Role.any())))
        })
        .catch(()=>{

        })

    }


    const [isPublished,setIsPublished ] = useState(false);

    function publishNote(){
        const permissions = note.$permissions;
    
        databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,[...permissions,Permission.read(Role.any())])
        .then((res)=>{
          //showToast("Note is now publicly visible!","warning")
          //loadNotes();
          setIsPublished(true);
        })
        .catch(()=>{
          //showToast("Error sharing note...","error")
        })
    }

    function unpublishNote(){

        var permissions = note.$permissions;

        permissions = permissions.filter(function(e) {
            return e !== Permission.read(Role.any());
          });
        
        databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,permissions)
        .then((res)=>{
          //showToast("Note is now publicly visible!","warning")
          //loadNotes();
          setIsPublished(false);
        })
        .catch(()=>{
          //showToast("Error sharing note...","error")
        })
        
    }


    function removeUserSharing(userId){
        const permissions = note.$permissions;

        permissions = permissions.filter(function(e) {
            return e !== Permission.read(Role.user(userId))      ||
                   e !== Permission.update(Role.user(userId))    ||
                   e !== Permission.delete(Role.user(userId)) ;
          });
    
        databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,permissions)
        .then((res)=>{
          //showToast("Note shared with " + userId,"success")
          //loadNotes();
          fetchNote();
        })
        .catch(()=>{
          //showToast("Error sharing note...","error")
        })
    }

      function shareNoteWithUser(userId){
        const permissions = note.$permissions;

        permissions.push(Permission.read(Role.user(userId)))
        permissions.push(Permission.update(Role.user(userId)))
        permissions.push(Permission.delete(Role.user(userId)))

        //console.log(Permission.delete(Role.user(userId)));
    
        databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,permissions)
        .then((res)=>{
          //showToast("Note shared with " + userId,"success")
          //loadNotes();
          fetchNote();
        })
        .catch(()=>{
          //showToast("Error sharing note...","error")
        })
      }

    return(<>
        <div className={props.display && !confirmed ? 'share-dialog' : 'share-dialog-hidden' }>
            <div>
                <div className="sh-top" >
                    <h4>Share this note</h4>
                    <img  onClick={()=>{props.onClose();setConfirmed(true)}} src={closeIcon}/>
                </div>
               
                
                    <p>You can quickly share a note with a friend to easily collaborate by providing the email associated to their Rubium account.</p>
                    {/* <p>{props.noteId ? props.noteId : "No note id"}</p> */}
                    <div className='sh-search'>
                        <input placeholder="Enter the email to share with"
                        value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                        <button className="share-btn" onClick={()=>{shareNoteWithUser(email);}}>Add</button>
                    </div>
                    <div className='shared-list'>
                        <div className='sh-list-item'>
                            <img className="sh-profile" src={"//unsplash.it/20/20"}/>
                            <p>teste@gmail.com</p>
                            <img className="sh-remove" src={removePerson}/>
                        </div>
                        <div className='sh-list-item'>
                            <img className="sh-profile" src={"//unsplash.it/20/21"}/>
                            <p>manuelsoares@hotmail.com</p>
                            <img className="sh-remove" src={removePerson}/>
                        </div>
                        <div className='sh-list-item'>
                            <img className="sh-profile" src={"//unsplash.it/21/20"}/>
                            <p>rato@esquilo.casca</p>
                            <img className="sh-remove" src={removePerson}/>
                        </div>
                        <div className='sh-list-item'>
                            <img className="sh-profile" src={"//unsplash.it/21/21"}/>
                            <p>noddy@ruca.pt</p>
                            <img className="sh-remove" src={removePerson}/>
                        </div>
                    </div>
                    <br></br>
                    <p>You can also publish it on the web, creating a share-able link</p>
                    {isPublished ?
                    <button className="share-can-btn" onClick={()=>{unpublishNote()}}>Un-Publish</button>:
                    <button className="share-can-btn" onClick={()=>{publishNote()}}>Publish</button>}
                  
                   
            </div>
        </div>
    </>)
}

export default ShareDialog