import { useEffect, useState } from 'react';
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';
import './Heading.css'

function Heading(props){

    const user = useUser();
    const lang = new LangTranslator("Heading",user);

    const [content,setContent] = useState({type:"h1",text:"",underline:false,color:""});
    const [index,setIndex] = useState(props.index);
    const [ff,setFF] = useState(0);

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


    function handleKeyDown(e,index,type){
        if(e.key === "Enter"){
            if(props && props.onEnter) props.onEnter(index,type);
        }
    }

    function handleMouseUp(){
        if(props && props.onMouseUp) props.onMouseUp();
    }

    function getPlaceholder(type){
        if(type == "h1") return lang.tr("Enter Heading H1...")
        else if(type == "h2") return lang.tr("Enter Heading H2...")
        else if(type == "h3") return lang.tr("Enter Heading H3...")
       }

    function setCurrentBlockId(id){
        if(props && props.setCurrentBlockId) props.setCurrentBlockId(id);
    }

    return(
        <>

            <input className={content.type}
                    style={{textDecoration:content.underline ? "underline" : "",color:content.color || ""}} 
                    id={"neid-" + index} 
                    placeholder={ props.editable ? getPlaceholder(content.type): ''}
                    onFocus={()=>{setCurrentBlockId(index)}}
                    onMouseDown={()=>{setCurrentBlockId(index)}}
                    onSelectCapture={()=>{handleMouseUp();}}
                    onKeyDown={(e)=>{handleKeyDown(e,index,content.type)}}
                    onChange={(e)=>{updateContent(e);}}                
                    value={content.text}
                    disabled={!props.editable }
                    onBlur={()=>{setCurrentBlockId(-1)}}
                />

        </>
    )

}

export default Heading;