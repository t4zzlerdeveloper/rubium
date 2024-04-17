import { useEffect, useState } from 'react';
import './Paragraph.css'
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';

function Paragraph(props) {

    const user = useUser();
    //! Change translation to Paragraph
    const lang = new LangTranslator("NoteEditor",user);

    const [content,setContent] = useState({type:"p",text:"",underline:false,color:""});
    const [editable,setEditable] = useState(false);
    const [index,setIndex] = useState(props.index);
    const [ff,setFF] = useState(0);

    useEffect(()=>{
        if(props && props.content){ setContent(props.content); setFF(ff+1);}
        if(props && props.editable) setEditable(props.editable);
    }
    ,[props]);

    function setCurrentBlockId(id){
        if(props && props.setCurrentBlockId) props.setCurrentBlockId(id);
    }

    function computeRows(){
       try{

        let height = document.getElementById("neid-" + index).scrollHeight;

        return height / 22;
       } 
       catch{
            return 1;
       }
    }

    function propagateContent(newContent){
        setContent(newContent);
        setFF(ff+1);
        if(props && props.onContentChange) props.onContentChange(newContent);
    }

    function updateContent(e,index){
        let copy = content;
        copy.text = e.target.value;
        propagateContent(copy);
    }

    function handleKeyDown(e,index,type){
        if(e.key === "Enter"){
            if(props && props.onEnter) props.onEnter(index,type);
        }
    }

    function handleMouseUp(){
        if(props && props.onMouseUp) props.onMouseUp();
    }



    return (<>        
        {ff > -1 ? <> 
            <textarea 
                className={content.type}
                style={{textDecoration:content.underline ? "underline" : "",color:content.color || ""}} 
                id={"neid-" + index} 
                placeholder={ editable ? lang.tr("Write a new paragraph...") : ''}
                onFocus={()=>{setCurrentBlockId(index)}}
                onMouseDown={()=>{setCurrentBlockId(index)}}
                onSelectCapture={()=>{handleMouseUp();}}
                onKeyDown={(e)=>{handleKeyDown(e,index,content.type)}} 
                onChange={(e)=>{updateContent(e,index)}}           
                value={content.text}
                disabled={!editable}
                onBlur={()=>{setCurrentBlockId(-1)}}
                rows={content ? computeRows() : 1}
            />
            </> : <></>}
        </>

    );
}

export default Paragraph;