import rubiumLogo from '../../assets/rubium-logomark.svg'
import shareIcon from '../../assets/share.svg'
import editIcon from '../../assets/edit_note.svg'
import syncingIcon from '../../assets/sync.svg'
import syncedIcon from '../../assets/cloud_upload.svg'
import viewIcon from '../../assets/visibility.svg'
import saveIcon from '../../assets/save.svg'
import logoutIcon from '../../assets/logout.svg'
import settingsIcon from '../../assets/settings.svg'
import deleteIcon from '../../assets/delete.svg'


import { useEffect, useRef, useState } from 'react'
import './NoteApp.css'
import { avatars, client, databases } from '../../lib/appwrite'
import { useUser } from '../../lib/context/user'
import { Functions, ID, Permission, Query, Role } from 'appwrite'
import Loader from '../../views/Loader'
import Toast from '../../views/Toast'
import Pomodoro from '../../views/Pomodoro'
import ConfirmationDialog from '../../views/ConfirmationDialog'
import ShareDialog from '../../views/ShareDialog'
import NoteEditor from '../../views/NoteEditor'

import LangTranslator from '../../lib/context/language'
import SettingsDialog from '../../views/SettingsDialog'
import GetStarted from '../../views/GetStarted'
import EmojiSelector from '../../views/EmojiSelector'
import Emoji from '../../views/Emoji'
import { useNavigate, useParams,} from 'react-router-dom'

const MAX_TOKENS = 10000;


function NoteApp() {

  const user = useUser();
  const navigate = useNavigate();
  const lang = new LangTranslator("NoteApp",user);

  const [editable, setEditable] = useState(false)
  const [charPosLog,setCharPosLog] = useState(0)
  const [links,setLinks] = useState([]);
  const [note,setNote] = useState("");

  const [notes,setNotes] = useState([]);

  const [searchQuery,setSearchQuery] = useState("");
  const [loadingNotes,setLoadingNotes] = useState(true);
  const [loadingCurrentNote,setLoadingCurrentNote] = useState(true);

  const [synced,setSynced] = useState(true);


  let {paramId} = useParams();

  useEffect(()=>{
    loadNoteById(paramId);
  },[paramId])

  useEffect(()=>{
    loadNotes();
  },[])

      //Shortcuts added CTRL-E to toggle view modes (Edit Mode & Read Mode)
      document.addEventListener('keydown', function(e) {
        if(e.ctrlKey || e.metaKey){
          if (e.key.toLowerCase() === 'e') {
            setEditable(!editable);
          }
        }
      });



  useEffect(()=>{
    window.document.title = (note.title ? note.title + " | " : "")  + "Rubium";
    setOpenEmoji(false);
  },[note])

  useEffect(()=>{
    loadNotes();
  },[searchQuery])

  function handleSearch(e){
    setSearchQuery(e.target.value);
  }


  function loadNoteById(id){
    setLoadingCurrentNote(true);
   
    databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,id)
    .then((res)=>{
      setNote(res).then(()=>{setLoadingCurrentNote(false);})
    })
    .catch((err)=>{
      if(err.toString().includes("requested ID could not be found.")){
        loadNotes(true);
      }
      else{
        setLoadingCurrentNote(false);
      }
    
    })
  }


  function loadNotes(last = false){
    setLoadingNotes(true);

    const queries = searchQuery.length > 0 ? [Query.search("title",searchQuery),Query.select(["$id","$updatedAt","title","$permissions","emoji"]),Query.orderDesc("$updatedAt")] : [Query.select(["$id","$updatedAt","title","$permissions","emoji"]),Query.orderDesc("$updatedAt")]
    databases.listDocuments(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID, queries)
    .then((res)=>{
      setNotes(res.documents);

      if(!paramId || last) switchToNote(res.documents[0]);

      setLoadingNotes(false);
    })
    .catch(()=>{setLoadingNotes(false);})


  }

  function saveCurrentNote(type = false,ctt = false){

    if(!ctt) setLoadingNotes(true);
    setSynced(false);
    if(computeTokensLeft() == 0) return;
   
      databases.updateDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id,{
        emoji:  type == "emoji" ? ctt : note.emoji,
        title:  type == "title" ? ctt : note.title,
        content: type == "content" ? ctt : note.content,
      })
      .then((res)=>{
        if(!ctt) loadNotes();
        setSynced(true);
      })
      .catch(()=>{
        setLoadingNotes(false)
        showToast(lang.tr("Error saving changes..."),"error")
      })
  }

  function deleteNote(note){
    setLoadingNotes(true);

      databases.deleteDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,note.$id)
      .then((res)=>{
        showToast(lang.tr("Note deleted successfully!"),"success")
        loadNotes(true);
      })
      .catch(()=>{
        showToast(lang.tr("Error deleting note..."),"error")
        setLoadingNotes(false);
      })
   
  }


  function createNewNote(title = undefined){

      const role = Role.user(user.current.$id);
      const permissions = [Permission.read(role),Permission.update(role),Permission.delete(role)];
      
      const data = {emoji:"",title:title ? title : lang.tr("New Note"),content:JSON.stringify([{type:"p",text:""}])};

      setLoadingNotes(true);
      databases.createDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,ID.unique(),data,permissions)
      .then((res)=>{
        loadNotes();
        showToast(lang.tr("Created a new note!"),"info")
        switchToNote({...data,$id:res.$id},true)
      })
      .catch(()=>{
        setLoadingNotes(false);
        showToast(lang.tr("Error creating new note..."),"error")
      })
 
  }

  function switchToNote(newNote,edit = false){
    if(!newNote) return;

    navigate("./"+newNote.$id)
    setSearchQuery("");
    setEditable(edit);
    setSynced(true);
  }
  


  const [saveTime,setSaveTime] = useState(-1);
  const [timerId, setTimerId] = useState(null);
  const[numChanges,setNumChanges] = useState(0);


  function triggerNoteChange(type,value){
    if(!note) return;
    setSynced(false);
    setNumChanges(numChanges+1);

    const copyTime = Date.now();

    if (saveTime == -1) setSaveTime(copyTime);
    else if(saveTime !== -1 && saveTime + 5000 <= copyTime ){
      setSaveTime(copyTime);
      saveCurrentNote(type,value);
    }

    let timeout = 1000;
    if(numChanges < 10 || type == "emoji"){
      timeout = 600;
    }
  
    clearTimeout(timerId);
    setTimerId(setTimeout(() => {
      saveCurrentNote(type,value);
    }, timeout));
  }


  function setNoteEmoji(newEmoji){
    if(newEmoji.length > 32) return;
    const oldEmoji = note.emoji;
        setNote({...note,emoji:newEmoji})
    let targetObject = notes.filter(n => n.$id === note.$id)
    targetObject[0].emoji = newEmoji;

    if(oldEmoji !== newEmoji) triggerNoteChange("emoji",newEmoji);
  }

  function setNoteTitle(newTitle){
    if(newTitle.length > 32) return;
    
    const oldTitle = note.title;
    setNote({...note,title:newTitle})
    let targetObject = notes.filter(n => n.$id === note.$id)
    targetObject[0].title = newTitle;

    if(oldTitle !== newTitle) triggerNoteChange("title",newTitle);
  }

  function setNoteContent(newContent){

    const oldContent = note.content;    
    setNote({...note,content:newContent});

    if(oldContent !== newContent) triggerNoteChange("content",newContent);
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
      dateString = lang.tr("Today at ");
       
    } else if(y.toDateString() == d.toDateString() ){
      dateString = lang.tr("Yesterday at ");
    }

    return dateString + " " +
      parseLeadingZeros(d.getHours()) + ":" + parseLeadingZeros(d.getMinutes());
   
  }
  
function checkNewNote(note){
  return user.current && note.$updatedAt === note.$createdAt;
}

function checkUpdate(note){
  return user.current &&  note.$permissions && note.$permissions.includes(Permission.update(Role.user(user.current.$id)))
}

function checkDelete(note){
  return user.current && note.$permissions && note.$permissions.includes(Permission.delete(Role.user(user.current.$id)))
}

function computeTokensLeft(customContent = note.content){
  if(!customContent) return 0;
  return Math.max(MAX_TOKENS - JSON.stringify(customContent).length,0); 
}

function computePercentageTokens(){
  if(!note && !note.content) return 0;
  return JSON.stringify(note.content).length /  MAX_TOKENS ; 
}

const [toastMessage,setToastMessage] = useState("");
function showToast(msg,type) {
  setToastMessage(msg)
  var x = document.getElementById("toast")
  const newClassName = "show " + type;
  x.className = x.className.replace(newClassName, "");
  setTimeout(function(){x.className = newClassName}, 100);
  setTimeout(function(){ x.className = x.className.replace(newClassName, ""); }, 4900);
}

const[openEmoji,setOpenEmoji] = useState();

const [noteToDelete,setNoteToDelete] = useState(null);
const [sharing,setSharing] = useState(false);
const [settings,setSettings] = useState(false);
const [userVerified,setUserVerified] = useState(true); 
const [emailResent,setEmailResent] = useState(false);

useEffect(()=>{
  if(user.current && !user.current.emailVerification) setUserVerified(false)
},[user])

  return (
    <div className='app'>
      
      <Pomodoro/>

      <Toast message={toastMessage}/>

      <ShareDialog display={sharing}
       noteId={note.$id}
       onClose={()=>{setSharing(false)}}
       />

      <SettingsDialog display={settings}
       onClose={()=>{setSettings(false)}}
       />

      <ConfirmationDialog display={noteToDelete !== null} 
      text={`${lang.tr("Are you sure you want to delete the note named")}\n "${noteToDelete && noteToDelete.title}"?`} 
      handleCancelation={()=>{setNoteToDelete(null);}} 
      handleConfirmation={()=>{deleteNote(noteToDelete);setNoteToDelete(null);}} />

      <ConfirmationDialog display={!userVerified && !emailResent} 
      text={lang.tr(`Verify your account with the link sent to your email to continue using Rubium. Press 'Done' after you verified the email.`)} 
      title={lang.tr("Email Verification Required")}
      cancelText={lang.tr("Re-send email")}
      confirmText={lang.tr("Done")}
      handleCancelation={async () => {
        user.sendVerification();
        setEmailResent(true);
      }}
      handleConfirmation={()=>{document.location.reload()}} />

    <ConfirmationDialog display={!userVerified && emailResent} 
      text={lang.tr(`We have re-sent the verification link to your email. Press 'Ok' when you are finished verifying it.`)} 
      title={lang.tr("Check your email again")}
      cancelText={lang.tr("Re-send again")}
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
          {lang.eval("_invertName") ? <p>Rubium<strong><br/> {lang.tr("of")} {user.current && user.current.name}</strong></p> : <p><strong>{user.current && user.current.name + "'s"}</strong><br/>Rubium</p>}
          
        </div>

        <div className='note-create'>
          <button onClick={()=>{createNewNote()}}>+</button>
          <input type="text" placeholder={lang.tr("Search notes...")} className='side-search' value={searchQuery} onChange={handleSearch}/>
        </div>
        
        <div className='notes-area'>
        {loadingNotes ? <Loader/>
         : notes.length !== 0 ? notes.map((nt)=>{
          return <div key={nt.$id} className={`side-item ${note.$id == nt.$id ? "side-item-selected" : ""}`} onClick={()=>{switchToNote(nt)}}>
            <p>
            <Emoji name={nt.emoji} textOnly={true}/>&nbsp;{nt.title}
              <a className={checkDelete(nt) ? checkNewNote(nt) ? "new" : "private" : "shared"}>&nbsp;
               {checkDelete(nt) ? parseDateTime(nt.$updatedAt) : lang.tr("Shared with me")} </a>
            </p>
            {checkDelete(nt) ? <img onClick={()=>{ setNoteToDelete(nt);}} src={deleteIcon}/> : <></>}
            </div>
        }): <div className="side-item no-items" >{searchQuery.length > 0 ? lang.tr("No results found") : lang.tr("Nothing to see here.")}</div>}
        </div>

        <div className='side-btns'>
          <button
              onClick={() => {setSettings(true)}}
              >{lang.tr("Settings")}<img src={settingsIcon}/>
          </button>
          <button
              onClick={async () => {
                await user.logout();
              }}
              >{lang.tr("Logout")} <img src={logoutIcon}/>
          </button>
          
        </div>
       
      </div>
      <div className='main-div'>
        <div className='main-controls'>
          {loadingCurrentNote || (!loadingNotes && notes.length == 0 && searchQuery.length == 0) ? <></>:<>
            {/* <a>{charPosLog}</a> */}
     
          
            <div className={'sv-to-cloud ' + (synced ? "" : "gray")}>
                <p>{computeTokensLeft() == 0 ? lang.tr("Token Limit reached :(") : synced ? lang.tr("Saved to the Cloud") : lang.tr("Saving...")}</p>
                {computeTokensLeft() > 0 && <><img 
                className={synced ? "" :  "sync-rotate"} style={synced ? {display: "none"} : null}
                src={syncedIcon} /><img 
                className={synced ? "" :  "sync-rotate"} style={synced ? null : {display: "none"}}
                src={syncingIcon}/></>}
            </div>

            {editable && <div className='rem-tokens'>
                <p>{computeTokensLeft()} {lang.tr("tokens left")}</p>
                <progress value={computePercentageTokens()} full={ computePercentageTokens() >= 1 ? "true": "false"} ></progress>
            </div>}
            
            
              <div className='edit-icon' onClick={()=>{
                if(editable){saveCurrentNote()};setEditable(!editable);setOpenEmoji(false)}} style={checkUpdate(note) ? null : {display: "none"}}>
                <img 
                src={viewIcon} style={editable ? null : {display: "none"}} />
                <img 
                src={editIcon} style={editable ? {display: "none"} : null}/>
                <p>{editable ?  lang.tr("Preview") : lang.tr("Edit") }</p>
              </div>
          
            
            <div  className="share-icon" onClick={()=>{setSharing(true)}} style={checkDelete(note) ? null : {display: "none"}}>
              <img src={shareIcon}/>
              <p>{lang.tr("Share")}</p>
            </div>
            
          </>}
        </div>
        {!loadingNotes && notes.length == 0 && searchQuery.length == 0 ?
        <GetStarted onStart={(t)=>{createNewNote(t)}}/>
        :loadingCurrentNote ? <Loader/> : <div className='main-div-inner'>

          <div className='emoji-title'>
            {!note.emoji && !editable ? <></> : <div className='emoji-con' onClick={()=>{if(editable){setOpenEmoji(!openEmoji)}}}>{note.emoji ? <Emoji size={"36px"} name={note.emoji}/> : editable ? <p>+</p> : <p></p>}</div>}
            <input className='note-title' disabled={!editable} type="text" value={note.title} onChange={(e)=>{setNoteTitle(e.target.value)}}/>
          </div>

          {openEmoji ? <EmojiSelector onSelect={(emj)=>{setNoteEmoji(emj);setOpenEmoji(false)}}/> : <></>}

          <NoteEditor 
          editable={editable}
          content={note.content} 
          setContent={(newContent)=>{setNoteContent(newContent)}} >
          </NoteEditor>
         
        </div>}
      </div>
      </>: <></>}
      <div className='mobile-dev'>
              <img src={rubiumLogo}/>
              <h1>{lang.tr("We are sorry but our app is still under development for smaller screens...")}</h1>
      </div>
    </div>
  )
}

export default NoteApp
