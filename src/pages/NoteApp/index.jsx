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
import { ID, Permission, Query, Role } from 'appwrite'
import Loader from '../../views/Loader'
import Toast from '../../views/Toast'
import ConfirmationDialog from '../../views/ConfirmationDialog'
import ShareDialog from '../../views/ShareDialog'



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
    const queries = searchQuery.length > 0 ? [Query.search("title",searchQuery),Query.select(["$id","$updatedAt","title","owner"]),Query.orderDesc("$updatedAt")] : [Query.select(["$id","$updatedAt","title","owner"]),Query.orderDesc("$updatedAt")]
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
      
      let noteElem = document.getElementById("note");
      const data = {title:note.title,owner:user.current.$id,content:noteElem.innerHTML};
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
        content: document.getElementById("note").innerHTML,
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
    setNotes([...notes,{$id:"draft",title:"New Note",content:""}]);
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
    console.log(newContent)
    setNote({...note,content:newContent});
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

    return dateString +
      d.getHours() + ":" + d.getMinutes();
   
  }
  

  function genRandomImage(){
    let x = Math.round((Math.random() * 200) + 100)
    let y = Math.round((Math.random() * 200) + 100)
    return `//unsplash.it/${x}/${y}`
  }

  function handleKeyUp(e){
    let noteElem = document.getElementById("note");
    var charPos = getCursorPosition(noteElem);
    setCharPosLog(charPos)
    
    if( (e.key == "Enter" ||e.key == " ") && editable){
      if(noteElem.innerHTML.includes("!random")) setNoteContent(noteElem.innerHTML.replace("!random",`<img src='${genRandomImage()}'/>`));
      if(noteElem.innerHTML.includes("--")) setNoteContent(noteElem.innerHTML.replace("--","<hr class='rounded'><br/>"));

      // var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      // var regex = new RegExp(expression);
      // let urls = noteElem.innerHTML.match(regex);
      // urls.forEach(link => {
      //   if(!(link in links)) setNote(noteElem.innerHTML.replace(link,`<a onClick='window.open("${link}")' href='#'>${link}</a>`))
      //   setLinks([...links,link])
      // });

      
      //setCurSelectionOffset(charPos)
      //noteElem.blur()
    }


  }


  function getCursorPosition(elem){
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(elem);
    clonedRange.setEnd(range.endContainer, range.endOffset);

    return clonedRange.toString().length;
  }



  //Set offset in current contenteditable field (for start by default or for with forEnd=true)
function setCurSelectionOffset(offset, forEnd = false) {
  const sel = window.getSelection();
  if (sel.rangeCount !== 1 || !document.activeElement) return;

  const firstRange = sel.getRangeAt(0);

  if (offset > 0) {
      bypassChildNodes(document.activeElement, offset);
  }else{
      if (forEnd)
          firstRange.setEnd(document.activeElement, 0);
      else
          firstRange.setStart(document.activeElement, 0);
  }



  //Bypass in depth
  function bypassChildNodes(el, leftOffset) {
      const childNodes = el.childNodes;

      for (let i = 0; i < childNodes.length && leftOffset; i++) {
          const childNode = childNodes[i];

          if (childNode.nodeType === 3) {
              const curLen = childNode.textContent.length;

              if (curLen >= leftOffset) {
                  if (forEnd)
                      firstRange.setEnd(childNode, leftOffset);
                  else
                      firstRange.setStart(childNode, leftOffset);
                  return 0;
              }else{
                  leftOffset -= curLen;
              }
          }else
          if (childNode.nodeType === 1) {
              leftOffset = bypassChildNodes(childNode, leftOffset);
          }
      }

      return leftOffset;
  }
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
        :  notes.length !== 0 ? notes.map((nt)=>{
          return <div className={`side-item ${note.$id == nt.$id ? "side-item-selected" : ""}`} onClick={()=>{switchToNote(nt)}}>
            <p>{nt.title}
              <a className={nt.$id == "draft" ? "draft" : (user.current && nt.owner == user.current.$id) ? "private" : "shared"}>&nbsp;
               {(user.current && nt.owner == user.current.$id) || nt.$id == "draft" ? nt.$id == "draft" ? "Draft Note" : parseDateTime(nt.$updatedAt) : "Shared with me"} </a>
            </p><img onClick={()=>{ setNoteToDelete(note);}} src={deleteIcon}/>
            </div>
        }): <></>}
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
            {note.owner == user.current.$id || note.$id == "draft" ?
              <div className='edit-icon' onClick={()=>{
                if(editable){saveCurrentNote()};setEditable(!editable)}}>
                <img 
                src={editable ? saveIcon : editIcon} />
                <p>{editable ?  "Save" : "Edit"}</p>
              </div>
            : <></>}
            {note.owner == user.current.$id ? 
            <div  className="share-icon" onClick={()=>{setSharing(true)}}>
              <img src={shareIcon}/>
              <p>Share</p>
            </div>
            : <></>}
          </>}
        </div>
        {loadingCurrentNote ? <Loader/> : <>
          <p style={{position:"absolute",color:"gray",fontSize:"10px"}}>{note.$id}</p>
          <input className='note-title' disabled={!editable} type="text" value={note.title} onChange={(e)=>{setNoteTitle(e.target.value)}}/>
          <div id="note" dangerouslySetInnerHTML={{__html: note.content || ""}} className='note-content' contentEditable={editable} onKeyUp={(e)=>{handleKeyUp(e)}} ></div>
        </>}
      </div>
    </div>
  )
}

export default NoteApp
