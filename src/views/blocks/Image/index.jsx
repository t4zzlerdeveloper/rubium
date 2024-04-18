import { useEffect, useState } from 'react'
import './Image.css'
import { useUser } from '../../../lib/context/user';
import LangTranslator from '../../../lib/context/language';

import imgIcon from '../../../assets/image.svg'
import { ID, storage } from '../../../lib/appwrite';
import Loader from '../../Loader';

function Image(props) {

    const user = useUser();
    //! Change translation to Image
    const lang = new LangTranslator("NoteEditor",user);

    const [content,setContent] = useState({type:"img",url:"",text:""});
    const [index,setIndex] = useState(props.index);
    const [ff,setFF] = useState(0);
    const [highlight,setHighlight] = useState(false);

    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(props && props.content){ setContent(props.content); }
        if(props && props.index) setIndex(props.index)
        setFF(ff+1);
    }
    ,[props]);

    function propagateContent(newContent){
        setContent(newContent);
        setFF(ff+1);
        if(props && props.onContentChange) props.onContentChange(newContent);
    }

    function updateContent(e){
        let copy = content;
        copy.text = e.target.value;
        propagateContent(copy);
    }

    function setImg(img){
        let copy = content;
        copy.url = img;
        propagateContent(copy);
    }

    function handleDragLeave(e){
        e.preventDefault();
        e.stopPropagation();
        setHighlight(false);
    }

    function handleDragEnter(e){
        e.preventDefault();
        e.stopPropagation();
        setHighlight(true);
    }

    function handleImageDrop(e){
        e.preventDefault();
        e.stopPropagation();
    }

    function handleUpload(e){
        e.preventDefault();
        e.stopPropagation();
        setHighlight(false);
    
        const files = e.target.files || e.dataTransfer.files;
    
        uploadFile(files[0]);
      };


      function uploadFile(file) {
        setLoading(true);
        
        storage.createFile(import.meta.env.VITE_IMAGE_BUCKET_ID,ID.unique(),file)
        .then(function (response) {
            const result = storage.getFilePreview(import.meta.env.VITE_IMAGE_BUCKET_ID, response.$id);
            setImg(result);
            setLoading(false);
            
        }, function (error) {
            setLoading(false);
        });

      }

      function handleImageClick(e){

        e.preventDefault();
        e.stopPropagation();

        let input = document.getElementById("imgid-" + index);
        input.click();
      }
        

    return (<>
    {loading ? <Loader/>: <>
            <div className="img" 
            onDrop={(e)=>{handleImageDrop(e)}} 
            onDragEnter={(e)=>{handleDragEnter(e)}}
            onDragLeave={(e)=>{handleDragLeave(e)}}>
             
        {content.url ? <>
            <img  id={"neid-" + index} src={content.url} onClick={(e)=>{handleImageClick(e)}}/>
            <input placeholder={ props.editable ? lang.tr("Enter an image caption..."): ''}  disabled={!props.editable } value={content.text}  onChange={(e)=>{updateContent(e)}} />

        </> : <></>}

        <form className='img-form' style={{display:content.url? "none":"flex",opacity:props.editable ? "1" : "0"}}>
                <img src={imgIcon}/>
                <p>{lang.tr("Click to choose an image from computer")}</p>
                <div className="img-up-btn">
                    <input
                    id={"imgid-" + index}
                    type="file"
                    className="upload-file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e)}
                    />
                </div>
        </form>

            </div>
            </>}
    </>
    )

}

export default Image