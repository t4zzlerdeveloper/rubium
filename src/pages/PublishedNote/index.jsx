import { useEffect, useState } from 'react'
import './PublishedNote.css'
import '../../pages/NoteApp/NoteApp.css'
import { databases } from '../../lib/appwrite';

function PublishedNote(){
   

    useEffect(()=>{
        const noteId = window.location.pathname.replace("/note/","");
        console.log(noteId)
        fetchNote(noteId)
    },[])

    const [note,setNote] = useState("");

    function fetchNote(noteId){
        databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,noteId)
        .then((res)=>{
            setNote(res);
        })
        .catch(()=>{

        })

    }

    return (<>
     <input className='note-title' type="text" value={note.title}/>
    <div id="note" dangerouslySetInnerHTML={{__html: note.content || ""}} className='note-content'></div>
    </>)
}

export default PublishedNote