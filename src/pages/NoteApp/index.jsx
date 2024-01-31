import rubiumLogo from '../../assets/rubium-logomark.svg'
import shareIcon from '../../assets/share.svg'
import editIcon from '../../assets/edit.svg'
import saveIcon from '../../assets/save.svg'
import logoutIcon from '../../assets/logout.svg'
import deleteIcon from '../../assets/delete.svg'

import { useEffect, useRef, useState } from 'react'
import './NoteApp.css'
import { databases } from '../../lib/appwrite'
import { useUser } from '../../lib/context/user'
import { Functions, ID, Permission, Query, Role } from 'appwrite'
import Loader from '../../views/Loader'
import Toast from '../../views/Toast'
import ConfirmationDialog from '../../views/ConfirmationDialog'
import ShareDialog from '../../views/ShareDialog'
import NoteEditor from '../../views/NoteEditor'



function NoteApp() {

  const user = useUser();

  const [editable, setEditable] = useState(false)
  const [charPosLog,setCharPosLog] = useState(0)
  const [links,setLinks] = useState([]);
  const [note,setNote] = useState("");

  const [notes,setNotes] = useState([]);

  const [searchQuery,setSearchQuery] = useState("");
  const [loadingNotes,setLoadingNotes] = useState(true);
  const [loadingCurrentNote,setLoadingCurrentNote] = useState(true);

  useEffect(()=>{
    loadNotes();
  },[])

  useEffect(()=>{
    loadNotes();
  },[searchQuery])

  function handleSearch(e){
    setSearchQuery(e.target.value);
  }

  function loadNoteById(id){
    if(id == "draft") setNote({$id:"draft",title:"New Note",content:""});
    setLoadingCurrentNote(true);
    databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,id)
    .then((res)=>{
      setNote(res)
      setLoadingCurrentNote(false);
    })
    .catch(()=>{setLoadingCurrentNote(false);})
  }


  function loadNotes(last = false){
    setLoadingNotes(true);
    const queries = searchQuery.length > 0 ? [Query.search("title",searchQuery),Query.select(["$id","$updatedAt","title","$permissions"]),Query.orderDesc("$updatedAt")] : [Query.select(["$id","$updatedAt","title","$permissions"]),Query.orderDesc("$updatedAt")]
    databases.listDocuments(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID, queries)
    .then((res)=>{
      //console.log(res.documents)
      setNotes(res.documents);

      if(note == "" || last) switchToNote(res.documents[0]);

      setLoadingNotes(false);
    })
    .catch(()=>{setLoadingNotes(false);})

  }

  function saveCurrentNote(){
    setLoadingNotes(true);
    if (note.$id == "draft"){
      const role = Role.user(user.current.$id);
      const permissions = [Permission.read(role),Permission.update(role),Permission.delete(role)];
      
      const data = {title:note.title,content:note.content};
      setNotes(notes.filter(item => item.$id !== "draft"));

      databases.createDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,ID.unique(),data,permissions)
      .then((res)=>{
        showToast("Saved new note successfully!","success")
        loadNotes(true);
      })
      .catch(()=>{
        showToast("Error saving new note...","error")
        setLoadingNotes(false);
      })
    }
    else{
      databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,{
        title: note.title,
        content: note.content,
      })
      .then((res)=>{
        showToast("Changes saved successfully!","success")
        loadNotes();
      })
      .catch(()=>{
        showToast("Error saving changes...","error")
      })
    }
  }

  function deleteNote(note){
    setLoadingNotes(true);

    if(note.$id == "draft"){
      setNotes(notes.filter(item => item.$id !== "draft"));
      showToast("Draft discarded successfully!","success")
      loadNotes(true);
    }
    else{
      databases.deleteDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id)
      .then((res)=>{
        showToast("Note deleted successfully!","success")
        loadNotes(true);
      })
      .catch(()=>{
        showToast("Error deleting note...","error")
        setLoadingNotes(false);
      })
    }
   
  }


  function createNewNote(){
    if(notes.find(item => item.$id === "draft")) return;

    setLoadingNotes(true);
    setEditable(true);
    showToast("Created a new draft!","info")
    setNotes([...notes,{$id:"draft",title:"New Note",content:[]}]);
    loadNoteById("draft");
    setLoadingNotes(false);
  }

  function switchToNote(newNote){
    if(newNote.$id === note.$id) return;

    setSearchQuery("");
    setEditable(false);
    loadNoteById(newNote.$id);
  }

  function setNoteTitle(newTitle){
    if(newTitle.length > 32) return;
    setNote({...note,title:newTitle})
    let targetObject = notes.filter(n => n.$id === note.$id)
    targetObject[0].title = newTitle;
  }

  function setNoteContent(newContent){
    //console.log(newContent)
    setNote({...note,content:newContent});
  }


  function parseLeadingZeros(number){
    const n = number.toString();
    return n.length == 1 ? "0" + n : n
  }

  function parseDateTime(datetime){
    const d = new Date(datetime);
    const n = new Date();
    const y = new Date();
    y.setDate(y.getDate() -1);
    
    let dateString = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear(); 
    if (d.toDateString() == n.toDateString()) {
      dateString = "Today at ";
       
    } else if(y.toDateString() == d.toDateString() ){
      dateString = "Yesterday at ";
    }

    return dateString + " " +
      parseLeadingZeros(d.getHours()) + ":" + parseLeadingZeros(d.getMinutes());
   
  }
  


function checkUpdate(note){
  return user.current &&  note.$permissions && note.$permissions.includes(Permission.update(Role.user(user.current.$id)))
}

function checkDelete(note){
  return user.current && note.$permissions && note.$permissions.includes(Permission.delete(Role.user(user.current.$id)))
}

const [toastMessage,setToastMessage] = useState("");
function showToast(msg,type) {
  setToastMessage(msg)
  var x = document.getElementById("toast")
  const newClassName = "show " + type;
  x.className = newClassName
  setTimeout(function(){ x.className = x.className.replace(newClassName, ""); }, 4900);
}

const [noteToDelete,setNoteToDelete] = useState(null);
const [sharing,setSharing] = useState(false);
const [userVerified,setUserVerified] = useState(true); 
const [emailResent,setEmailResent] = useState(false);

useEffect(()=>{
  if(user.current && !user.current.emailVerification) setUserVerified(false)
},[user])

  return (
    <div className='app'>
      <Toast message={toastMessage}/>

      <ShareDialog display={sharing}
       noteId={note.$id}
       onClose={()=>{setSharing(false)}}
       />

      <ConfirmationDialog display={noteToDelete !== null} 
      text={`Are you sure you want to delete the note named\n "${noteToDelete && noteToDelete.title}"?`} 
      handleCancelation={()=>{setNoteToDelete(null);}} 
      handleConfirmation={()=>{deleteNote(noteToDelete);setNoteToDelete(null);}} />

      <ConfirmationDialog display={!userVerified && !emailResent} 
      text={`Verify your account with the link sent to your email to continue using Rubium. Press 'Done' after you verified the email.`} 
      title={"Email Verification Required"}
      cancelText={"Re-send email"}
      confirmText={"Done"}
      handleCancelation={async () => {
        user.sendVerification();
        setEmailResent(true);
      }}
      handleConfirmation={()=>{document.location.reload()}} />

    <ConfirmationDialog display={!userVerified && emailResent} 
      text={`We have re-sent the verification link to your email. Press 'Ok' when you are finished verifying it.`} 
      title={"Check your email again"}
      cancelText={"Re-send again"}
      confirmText={"Ok"}
      handleCancelation={async () => {
        user.sendVerification();
        setEmailResent(false);
      }}
      handleConfirmation={()=>{document.location.reload()}} />


      {userVerified ? <>
      <div className='sidebar'>
        <div className='side-title'>
          <img src={rubiumLogo}/>
          <p><strong>{user.current && user.current.name + "'s"}</strong><br/>Rubium</p>
        </div>

        <div className='note-create'>
          <button onClick={()=>{createNewNote()}}>+</button>
          <input type="text" placeholder="Search notes..." className='side-search' value={searchQuery} onChange={handleSearch}/>
        </div>
        
        {loadingNotes ? <Loader/>
         : notes.length !== 0 ? notes.map((nt)=>{
          return <div key={nt.$id} className={`side-item ${note.$id == nt.$id ? "side-item-selected" : ""}`} onClick={()=>{switchToNote(nt)}}>
            <p>{nt.title}
              <a className={nt.$id == "draft" ? "draft" : checkDelete(nt) ? "private" : "shared"}>&nbsp;
               {checkDelete(nt) || nt.$id == "draft" ? nt.$id == "draft" ? "Draft Note" : parseDateTime(nt.$updatedAt) : "Shared with me"} </a>
            </p>
            {checkDelete(nt) ? <img onClick={()=>{ setNoteToDelete(note);}} src={deleteIcon}/> : <></>}
            </div>
        }): <div className="side-item" >Nothing to see here.</div>}
        <button
            className='side-logout'
            type="button"
            onClick={async () => {
              await user.logout();
            }}
            >Logout <img src={logoutIcon}/></button>
      </div>
      <div className='main-div'>
        <div className='main-controls'>
          {loadingCurrentNote ? <></>:<>
            {/* <a>{charPosLog}</a> */}
            {checkUpdate(note) || note.$id == "draft" ?
              <div className='edit-icon' onClick={()=>{
                if(editable){saveCurrentNote()};setEditable(!editable)}}>
                <img 
                src={editable ? saveIcon : editIcon} />
                <p>{editable ?  "Save" : "Edit"}</p>
              </div>
            : <></>}
            {checkDelete(note) ? 
            <div  className="share-icon" onClick={()=>{setSharing(true)}}>
              <img src={shareIcon}/>
              <p>Share</p>
            </div>
            : <></>}
          </>}
        </div>
        {loadingCurrentNote ? <Loader/> : <div className='main-div-inner'>
          {/* <p style={{position:"absolute",color:"gray",fontSize:"10px"}}>{note.$id}</p> */}
          <input className='note-title' disabled={!editable} type="text" value={note.title} onChange={(e)=>{setNoteTitle(e.target.value)}}/>

          <NoteEditor 
          editable={editable}
          content={note.content} 
          setContent={(newContent)=>{setNoteContent(newContent)}} >
          </NoteEditor>
         
        </div>}
      </div>
      </>: <></>}
    </div>
  )
}

export default NoteApp
