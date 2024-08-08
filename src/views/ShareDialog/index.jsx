import { useEffect, useState } from 'react';
import './ShareDialog.css'

import axios from 'axios';

import { avatars,databases,functions } from '../../lib/appwrite'
import { useUser } from '../../lib/context/user';

import removePerson from '../../assets/person_remove.svg'
import closeIcon from '../../assets/close.svg'
import downloadIcon from '../../assets/download.svg'
import { Functions, Permission, Role } from 'appwrite';
import Loader from '../Loader';
import LangTranslator from '../../lib/context/language';



function ShareDialog(props){

  const user = useUser();
  const lang = new LangTranslator("ShareDialog",user);

    const [confirmed,setConfirmed] = useState(false);
    const [email,setEmail] = useState("");

    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(props.display) setConfirmed(false);
    },[props.display])

    useEffect(()=>{
        if(props.noteId) fetchNote();
    },[props.noteId])


    function fetchNote(){
        if(props.reloadUsers) props.reloadUsers();
        // databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,props.noteId)
        // .then((res)=>{
        //     setNote(res);
        //     setIsPublished(note.$permissions.includes(Permission.read(Role.any())))
        // })
        // .catch(()=>{

        // })
    }


    // const [isPublished,setIsPublished ] = useState(false);

    // function publishNote(){
    //     const permissions = note.$permissions;
    
    //     databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,[...permissions,Permission.read(Role.any())])
    //     .then((res)=>{
    //       //showToast("Note is now publicly visible!","warning")
    //       //loadNotes();
    //       setIsPublished(true);      
    //     })
    //     .catch(()=>{
    //       //showToast("Error sharing note...","error")
    //     })
    // }

    // function unpublishNote(){

    //     var permissions = note.$permissions;

    //     permissions = permissions.filter(function(e) {
    //         return e !== Permission.read(Role.any());
    //       });
        
    //     databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,undefined,permissions)
    //     .then((res)=>{
    //       //showToast("Note is now publicly visible!","warning")
    //       //loadNotes();
    //       setIsPublished(false);
    //     })
    //     .catch(()=>{
    //       //showToast("Error sharing note...","error")
    //     })
        
    // }


    function removeUserSharing(email){

      if(!user.current || !props.noteId) return;

      setLoading(true);
      const headers= {
        'Content-Type': 'application/json'
      };

      const dataToPost = {
        ownerId: user.current.$id,
        sessionId: user.current.sessionId,
        noteId: props.noteId,
        email: email
      };


      functions.createExecution(
        '65a6f370b6b21d9a78d2',
        JSON.stringify(dataToPost),
        false,
        '/',
        'DELETE',
        headers
        ).then((res)=>{
          console.log(res)
          fetchNote();
          setLoading(false)
        })
        .catch(()=>{
          setLoading(false)
        })
    }

      function shareNoteWithUser(email){

        if(!user.current || !props.noteId) return;

        setLoading(true);

        const headers= {
          'Content-Type': 'application/json'
        };

        const dataToPost = {
          ownerId: user.current.$id,
          sessionId: user.current.sessionId,
          noteId: props.noteId,
          email: email
        };


        functions.createExecution(
          '65a6f370b6b21d9a78d2',
          JSON.stringify(dataToPost),
          false,
          '/',
          'POST',
          headers
          ).then((res)=>{
            fetchNote();
            setEmail("");
            setLoading(false)
          })
          .catch(()=>{
            setLoading(false);
          })
        
      }



      const [generatingPDF,setGeneratingPDF] = useState(false);

      function downloadPDF(){

        setGeneratingPDF(true);

        const headers= {
          'Content-Type': 'application/json',
        };

        const query = `?ownerId=${user.current.$id}&sessionId=${user.current.sessionId}&noteId=${props.noteId}`

        window.open("https://664dfd51e4a386f7c001.appwrite.global"+query,"_blank");

        setGeneratingPDF(false);


        // functions.createExecution(
        //   '664dfd51000609ec99ec',
        //   '',
        //   false,
        //   '/'+query,
        //   'GET'
        //   ).then((res)=>{

        //     if(res.responseBody == null || res.responseStatusCode != 200){
        //       setGeneratingPDF(false);
        //       return;
        //     }

        //     const blob = new Blob([res.responseBody], { type: 'application/pdf' });
        //     const url = window.URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = note.title + ".pdf";
        //     a.click();
        //     window.URL.revokeObjectURL(url);

        //     setGeneratingPDF(false);
        //   })
        //   .catch(()=>{
        //     setGeneratingPDF(false);
        //   })
      }

    return(<>
        <div className={props.display && !confirmed ? 'share-dialog' : 'share-dialog-hidden' }>
            <div>
                <div className="sh-top" >
                    <h4>{lang.tr("Share this note")}</h4>
                    <img  onClick={()=>{props.onClose();setConfirmed(true)}} src={closeIcon}/>
                </div>
               
                
                    <p>{lang.tr("You can quickly share a note with a friend to easily collaborate by providing the email associated to their Rubium account.")}</p>
                    {/* <p>{props.noteId ? props.noteId : "No note id"}</p> */} 
                    <div className='sh-search'>
                        <input placeholder={lang.tr("Enter the email to share with")}
                        value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                         {loading || props.loadingUsers ? <Loader/> : <button className="share-btn" onClick={()=>{shareNoteWithUser(email);}}>{lang.tr("Add")}</button>}
                    </div>
                    <div className='shared-list'>
                      {loading || props.loadingUsers ? <></> : props.sharedUsers.length == 0 ? 
                        <p>{lang.tr("You haven´t shared this note with anyone yet.")}</p>
                       : props.sharedUsers.map((u,index)=>{
                        return <div className='sh-list-item' key={"sh-lu-" + index}>
                                  <img className="sh-profile" src={avatars.getInitials(u.name)}/>
                                  <p>{u.name + " (" + u.email + ")"}</p>
                                  <img className="sh-remove" src={removePerson} onClick={()=>{removeUserSharing(u.email)}}/>
                                </div>
                      })}
                    </div>
             
                    <br></br>
               
                    <div className='sh-down-div'>
                      <button className='share-can-btn' onClick={()=>{if(!generatingPDF){downloadPDF()}}} disabled={generatingPDF}>
                        <img src={downloadIcon} className={generatingPDF ? 'sh-down-anim' : ''}/>
                        { generatingPDF ? lang.tr("Generating...") : lang.tr("Download PDF")}
                      </button>
                      <p>{lang.tr("This feature allows you to download your note as a PDF to share, print, or simply enjoy on paper.")}</p>
                    </div>
                    {/* <p>(Experimental) {lang.tr("You can also publish it on the web, creating a share-able link")}</p>
                    {isPublished ?
                    <>
                      <div>
                        <a onClick={()=>{navigator.clipboard.writeText(`${window.location.host}/note/${note.$id}`)}}>{`${window.location.host}/note/${note.$id}` }</a>
                      </div>
                      <button className="share-can-btn" onClick={()=>{unpublishNote()}}>{lang.tr("Un-Publish")}</button>
                    </>:
                    <button className="share-can-btn" onClick={()=>{publishNote()}}>{lang.tr("Publish")}</button>}
                   */}
                   
            </div>
        </div>
    </>)
}

export default ShareDialog