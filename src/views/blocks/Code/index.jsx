import { useEffect, useState } from 'react';
import './Code.css'

import copyIcon from '../../../assets/content_copy.svg'
import formatCode from '../../../assets/code.svg'
import rubiumLogo from '../../../assets/rubium-logomark.svg'
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';
import CodeMirror from './CodeMirror';


const codeLangs = [
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Markdown",
    "Java",
    "Go",
    "Python",
    "Swift",
    "C#",
    "C++",
    "C",
    "PHP",
    "SQL"
]

function Code(props){

    const user = useUser();
    //! Change translation to Kanban
    const lang = new LangTranslator("NoteEditor",user);

    const[content,setContent] = useState({text:"",lang:"JavaScript",cl:false});
    const[editable,setEditable] = useState(false);
    const[index,setIndex] = useState(props.index);
    const[ff,setFF] = useState(0);

    useEffect(()=>{
        if(props && props.content){ setContent(props.content); setFF(ff+1);}
        if(props && props.editable) setEditable(props.editable);
    }
    ,[props]);

    function propagateContent(newContent){
        setContent(newContent);
        setFF(ff+1)
        if(props && props.onContentChange) props.onContentChange(newContent);
    }


    function updateCodeLang(e){
        let copy = content;
        copy.lang = e.target.value;
        propagateContent(copy);
    }

    function invertCodeCL(){
        let copy = content;
        copy.cl = !copy.cl;
        propagateContent(copy);
    }

    function handleCodeCopy(e,text){
        const type = "text/plain";
        const blob = new Blob([text], { type });
        const data = [new ClipboardItem({ [type]: blob })];
    
        const parent = e.target.parentNode;
        const copyTR = lang.tr("Copy");
        const copiedTR = lang.tr("Copied!");
        const errorTR = lang.tr("Error copying...");
    
        navigator.clipboard.write(data)
        .then(()=>{
            parent.innerHTML =  parent.innerHTML.replace(copyTR,copiedTR);
            setTimeout(()=>{
                parent.innerHTML =  parent.innerHTML.replace(copiedTR,copyTR);
            },1500)
        }).catch(()=>{
            parent.innerHTML =  parent.innerHTML.replace(copyTR,errorTR);
            setTimeout(()=>{
                parent.innerHTML =  parent.innerHTML.replace(errorTR,copyTR);
            },1500)
        });
       }

    function updateContent(e){
        let copy = content;
        copy.text = e.target.value;
        propagateContent(copy);
    }


    return (
        <>
            {ff > -1 ? <>
                <div className='code'>
                        
                            <div className='cd-flex'>
                            <div className="cd-copy" ><img  onClick={(e)=>{handleCodeCopy(e,content.text)}} src={copyIcon}/>{lang.tr("Copy")}                 
                            {editable ? <>&nbsp;&nbsp;&nbsp;<img className={!content.cl ? 'cd-rot' : 'cd-collapse'} src={formatCode} onClick={()=>{invertCodeCL()}}/> {content.cl ? lang.tr("Expand") : lang.tr("Collapse")} </>: <></>}</div>
                                
                                <div>
                                {lang.tr("Language")}&nbsp;&nbsp;&nbsp;<select value={content.lang} onChange={(e)=>{updateCodeLang(e)}} disabled={!editable}>
                                    {codeLangs.map((l)=>{
                                        return <option key={"b-cd-"+l} value={l}>{l}</option>
                                    })}
                                </select>
                                </div>
                            </div>
                           
                            <CodeMirror
                            editable={editable} 
                            value={content.text}
                            onChange={(e)=>{updateContent(e)}}
                            collapsed={content.cl}
                            language={content.lang}/>
                            
                            <div className='cd-logo'>POWERED BY C<img src={rubiumLogo} />DE MIRROR</div>
                </div>
            </> : <></>}
        </>
    )
}

export default Code;