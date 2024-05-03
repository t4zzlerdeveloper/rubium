import { useEffect, useState, useRef} from 'react';
import './Paragraph.css'
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';

import promptIcon from '../../../assets/prompt_suggestion.svg';
import paragraphIcon from '../../../assets/format_p.svg';
import Loader from '../../Loader';

import axios from 'axios';

function Paragraph(props) {

    const textAreaRef = useRef(null);

    const user = useUser();
    //! Change translation to Paragraph
    const lang = new LangTranslator("NoteEditor",user);

    const [content,setContent] = useState({type:"p",text:"",underline:false,color:""});
    const [index,setIndex] = useState(props.index);
    const [ff,setFF] = useState(0);

    useEffect(()=>{
        if(props && props.content){ setContent(props.content); }
        if(props && props.index) setIndex(props.index)
        setFF(ff+1);
    }
    ,[props]);

    useEffect(()=>{
        textAreaRef.current.parentNode.dataset.replicatedValue = textAreaRef.current.value;
    },[textAreaRef.current]);


    function setCurrentBlockId(id){
        if(props && props.setCurrentBlockId) props.setCurrentBlockId(id);
    }

    function propagateContent(newContent){
        setContent(newContent);
        setFF(ff+1);
        if(props && props.onContentChange) props.onContentChange(newContent);
    }

    function updateContent(e){
        let copy = content;
        copy.text = e.target.value;
        textAreaRef.current.parentNode.dataset.replicatedValue = e.target.value;
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

    const[aiWorking,setAIWorking] = useState(false);

    function completeText(i = 0){

        setAIWorking(true);
        
        axios.post("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {inputs: content.text},    
        {
            headers: { Authorization: "Bearer " + import.meta.env.VITE_APP_HUGGING_FACE_API_KEY },
        }
        ).then((res)=>{
            const lastText = content.text;
            const generatedText = res.data[0].generated_text;

            updateContent({target:{value:generatedText}});

            if(lastText.length < generatedText.length && i < 4){
                completeText(i+1);
            }
            else{
                textAreaRef.current.focus();
                setAIWorking(false);
            }

        }).catch((err)=>{
            setAIWorking(false);
        })
        
}


    function summarizeText(){
        setAIWorking(true);
        axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {inputs: content.text},    
            {
                headers: { Authorization: "Bearer " + import.meta.env.VITE_APP_HUGGING_FACE_API_KEY },
            }
            ).then((res)=>{
                setAIWorking(false);
                const summaryText = res.data[0].summary_text;
                updateContent({target:{value:summaryText}});        
                textAreaRef.current.focus();
            }).catch((err)=>{
                setAIWorking(false);
            });   
    }


    return (<>        
        {ff > -1 ? <> 
        <div className='grow-wrap'>
            <textarea 
                ref={textAreaRef}
                className={content.type}
                style={{textDecoration:content.underline ? "underline" : "",color:content.color || ""}} 
                id={"neid-" + index} 
                placeholder={ props.editable ? lang.tr("Write a new paragraph...") : ''}
                onFocus={()=>{setCurrentBlockId(index)}}
                onMouseDown={()=>{setCurrentBlockId(index)}}
                onSelectCapture={()=>{handleMouseUp();}}
                onKeyDown={(e)=>{handleKeyDown(e,index,content.type)}} 
                onChange={(e)=>{updateContent(e);}}           
                value={content.text}
                disabled={!props.editable}
                onBlur={()=>{setCurrentBlockId(-1)}}
                onInput={(e)=>{e.target.parentNode.dataset.replicatedValue = e.target.value;}}
            />
            {   props.editable && textAreaRef 
            // && (document.activeElement == textAreaRef.current) 
            ? aiWorking ? <Loader/> : <>
            <section className='p-ai-section'>

                <button className='p-ai-btn' onClick={()=>{completeText()}}>
                    <img src={promptIcon} />
                    <p>{lang.tr("Ask Mistral AI")}</p>
                </button>

                {content.text.length > 240 ?
                <button className='p-ai-btn' onClick={()=>{summarizeText()}}>
                     <img src={paragraphIcon} />
                    <p>{lang.tr("Summarize text")}</p>
                </button> : <></>}

              
            </section>
            </> : <></>}
        </div>
            </> : <></>}
        </>

    );
}

export default Paragraph;
