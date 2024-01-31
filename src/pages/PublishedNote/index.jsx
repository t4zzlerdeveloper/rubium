import { useEffect, useState } from 'react'
import './PublishedNote.css'
import '../../pages/NoteApp/NoteApp.css'
import { databases } from '../../lib/appwrite';
import NoteEditor from '../../views/NoteEditor';
import Loader from '../../views/Loader';

function PublishedNote(){
   

    useEffect(()=>{
        const noteId = window.location.pathname.replace("/note/","");
        console.log(noteId)
        fetchNote(noteId)
    },[])

    const [note,setNote] = useState("");
    const [loading,setLoading] = useState(true);

    function fetchNote(noteId){
        databases.getDocument(import.meta.env.VITE_DATABASE_ID,import.meta.env.VITE_NOTES_COLLECTION_ID,noteId)
        .then((res)=>{
            setNote(res);
            setLoading(false);
        })
        .catch(()=>{
            setLoading(false);
        })

    }

    return (<div className='pub-note'>
   
    {loading ? <Loader/> : <>
    <input className='note-title' type="text" value={note.title}/>
     <NoteEditor content={note.content} setContent={(n)=>{}} editable={false} />
    </>}

    </div>)
}

export default PublishedNote