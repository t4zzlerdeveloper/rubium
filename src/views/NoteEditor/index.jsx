import { useEffect, useState } from 'react'
import './NoteEditor.css'

import rubiumLogo from '../../assets/rubium-logomark.svg'

import formatH1 from '../../assets/format_h1.svg'
import formatH2 from '../../assets/format_h2.svg'
import formatP from '../../assets/format_p.svg'
import formatImg from '../../assets/image.svg'
import formatSep from '../../assets/separator.svg'
import formatKanban from '../../assets/kanban.svg'
import formatCode from '../../assets/code.svg'


import copyIcon from '../../assets/content_copy.svg'
import addInd from '../../assets/add.svg'
import removeInd from '../../assets/delete.svg'
import arrowRight from '../../assets/arrow-right.svg'
import dragInd from '../../assets/drag_indicator.svg'

import LangTranslator from '../../lib/context/language'


import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from '../../lib/context/user'
import CodeBlock from '../blocks/CodeBlock'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GOOGLE_API_KEY);


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


function NoteEditor(props){


    const user = useUser();
    const lang = new LangTranslator("NoteEditor",user);

    const [ff,setFF] = useState(0);

    const initialContent = props.content ? JSON.parse(props.content) : [{type:"p",text:""}];

    const [content,setContent] = useState(initialContent)


    useEffect(()=>{
        try{document.getElementById("neid-"+(content.length-1)).focus();}
        catch{}
    },[content])

    useEffect(()=>{
        props.setContent(JSON.stringify(content))
    },[ff])



    function array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    function swapBlocks(x,y){
        let ctCopy = content;
        var b = ctCopy[x];
        ctCopy[x] = ctCopy[y];
        ctCopy[y] = b;
        setContent(ctCopy);
        setFF(ff+1);
    }

    function insertBlockOn(x,type,url=undefined,alt=undefined){
        let ctCopy = content;
        let initialContent = {
            type:type,
            text:""
        };

        if(type == "kb"){
            initialContent = {
                type:type,
                title:"",
                backlog:[],
                doing:[],
                done:[]
            }
        }

        if(type =="img"){
            const x = Math.round(Math.random() * 300) + 200;
            const y = Math.round(Math.random() * 300) + 200;
            initialContent = {
                type:type,
                text : alt ? alt :"",
                url : url ? url : `//unsplash.it/${x}/${y}`
            }
        }

        if(type == "cd"){
            initialContent = {
                type:type,
                text:"",
                lang:codeLangs[0]          
            }
        }

        ctCopy = [
            ...ctCopy.slice(0, x),
            initialContent,
            ...ctCopy.slice(x)
        ];
        setContent(ctCopy);
        setFF(ff+1);
        document.getElementById("neid-"+x).focus();
    }

    function moveBlockTo(x,newX){
        let ctCopy = content;
        ctCopy = array_move(ctCopy,x,newX)
        setContent(ctCopy);
        setFF(ff+1);
    }

    function removeBlock(idx){
        let ctCopy = content;
        setContent(ctCopy.filter((a,index)=>{
            if(index !== idx){ return a}
        }))
        setFF(ff+1);
    }

    function handleKeyDown(e,index,type){
        
        if(e.key == "ArrowUp" && index >= 1){
            index--;
        }
        else if(e.key == "ArrowDown" && index <= content.length-2){
            index++;
        }
        else if(e.key == "Backspace"){
            
            if( document.getElementById("neid-"+index).value == ""){
                e.preventDefault();
                removeBlock(index)
            }
          
        }
        else if(e.key == "Enter" && (type =="h1" || type == "h2")){
            e.preventDefault();
            index++;
        }
        document.getElementById("neid-"+index).focus();
       
    }


    function boldSelected(){
        let a = document.getElementById("neid-"+currentBlockId)
        var start =  a.selectionStart;
        var end =  a.selectionEnd;
        const cText = content[currentBlockId].text;
        const left = cText.slice(0,start);
        const middle = cText.slice(start,end);
        const right= cText.slice(end,cText.length-1);

        let newText = left + "<b>" + middle + "</b>" + right;

        console.log([left,middle,right])
        console.log(newText)
     
        content[currentBlockId].text = newText.replace("<b><b>","").replace("</b></b>","");
        setFF(ff+1)
    }

    function updateContent(e,index){
        let copy = content;

        copy[index].text = e.target.value;
        setContent(copy);
        //console.log(content)
        setFF(ff+1)
    }

    function updateCodeLang(e,index){
        let copy = content;
        copy[index].lang = e.target.value;
        setContent(copy);
        setFF(ff+1)
    }

    function invertCodeCL(index){
        let copy = content;
        copy[index].cl = !copy[index].cl;
        setContent(copy);
        setFF(ff+1)
    }

    function updateUrl(index,newUrl,newText){
        let copy = content;
        copy[index].url = newUrl;
        copy[index].text = newText;
        setContent(copy);
        setFF(ff+1)
    }


    const [toolStyle,setToolStyle] = useState({display:"none"});
    const [currentBlockId,setCurrentBlockId] = useState(null);

    function handleMouseUp(){

        let a = document.getElementById("neid-"+currentBlockId)
        let left = a.selectionStart;
        let width = a.selectionEnd-a.selectionStart;
        console.log(left,width)
    
        let selection = window.getSelection(),
        selectionRect = a.getBoundingClientRect();
         
        if(width == 0 || !props.editable) {setToolStyle({display:"none"}); return;}
    
       setToolStyle({
          top: selectionRect.top - 42 + 'px',
          left: ( selectionRect.left + (left * 7) +  (width * 3.5)) + 'px'
        });
    }

    const[blockDragging,setBlockDragging] = useState(-1);
    const[enabledDrop,setEnabledDrop] = useState(-1);

    function handleDropEnter(index){
        if(props.editable) setEnabledDrop(index)
    }
    
    function handleDragStart(index){
        if(props.editable) setBlockDragging(index);
    }

    function handleDragEnd(e,index){
        
        if(enabledDrop != -1){
            if(index < enabledDrop){
                moveBlockTo(index,enabledDrop-1)
            }
            else{
                moveBlockTo(index,enabledDrop)

            }
           setEnabledDrop(-1)
        }
        setBlockDragging(-1)

    }

    function handleDropLeave(){
           if(blockDragging == -1) setEnabledDrop(-1)
    }

    const[creatingBlock,setCreatingBlock] = useState(-1);
    const[crtBlockStyle,setCrtBlockStyle] = useState({top:"0",left:"0"});

    function handleBlockCreationOpen(e,index){
        setCreatingBlock(index);
        //let blockCreator = document.getElementById("crt-blk");
        let addButton = document.getElementById("addeid-"+index);
        const rect = addButton.getBoundingClientRect();

        if(rect.top > window.innerHeight -268){
            //!fix size to dynamic
            setCrtBlockStyle(
                {
                    top:rect.top - 248,
                    left:rect.left -15 ,
                    paddingBottom: "35px"
                }
            )
        }
        else{
            setCrtBlockStyle(
                {
                    top:rect.top -5,
                    left:rect.left -15 ,
                    paddingTop: "35px",
                }
            )
        }

      
    }

    function addBlock(type){
        insertBlockOn(creatingBlock,type);
        setCreatingBlock(-1);
    }


    function handleNewImageDrop(e,index){
        e.preventDefault();
        if(!props.editable)return;
        let html = e.dataTransfer.getData('text/html');
        let src = new DOMParser().parseFromString(html, "text/html")
        .querySelector('img').src;
        let alt = new DOMParser().parseFromString(html, "text/html")
        .querySelector('img').alt;
        insertBlockOn(index,"img",src,alt);
        setEnabledDrop(-1)
    }

    function handleImageDrop(e,index){
        e.preventDefault();
        if(!props.editable)return;
        let html = e.dataTransfer.getData('text/html');
        let src = new DOMParser().parseFromString(html, "text/html")
        .querySelector('img').src;
        let alt = new DOMParser().parseFromString(html, "text/html")
        .querySelector('img').alt;
        updateUrl(index,src,alt)
    }


   function getPlaceholder(type){
    if(type == "p") return lang.tr("Write a new paragraph...");
    else if(type == "img") return lang.tr("Enter an image caption...")
    else if(type == "h1") return lang.tr("Enter Heading H1...")
    else if(type == "h2") return lang.tr("Enter Heading H2...")
   }


   const[kanbanDragArea,setKanbanDragArea] = useState(null);

   function handleKanbanDrop(index,idx,phase){
        if(kanbanDragArea) moveKanban(index,idx,phase,kanbanDragArea);
    }


   function setKanbanTitle(index,newTitle){
    let copy = content;
    copy[index].title = newTitle;
    setContent(copy);
    setFF(ff+1)
   }

   function addKanban(phase,index,task){
    let copy = content;
    copy[index][phase].push(task);
    setContent(copy);
    setFF(ff+1)
   }

   function moveKanban(index,idx,currentPhase,newPhase){
        let copy = content;
        let task = copy[index][currentPhase].splice(idx,1);
        copy[index][newPhase].push(task);
        setContent(copy);
        setFF(ff+1)
   }

   function removeKanban(phase,index,idx){
    let copy = content;
    copy[index][phase].splice(idx,1);
    setContent(copy);
    setFF(ff+1)
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


    //Gen AI related
    const [prompt,setPrompt] = useState("");
    const [generated,setGenerated] = useState("");

    async function generateContent(){
        const prt = prompt;
        setPrompt("");
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const result = await model.generateContent(prt);
        const response = await result.response;
        const text = response.text();
        setGenerated(text);
    }

      
    return (<div className='note-editor'>
           <section 
                id={"drop-0"}
                onDragOver={(e)=>{handleDropEnter(0)}}
                onDragLeave={(e)=>{handleDropLeave(e,0)}}
                drop-enabled={enabledDrop == 0 ? "true" : "false" }
                className='drop-spot'
                onDrop={(e)=>{handleNewImageDrop(e,index+1)}}
            ><div className='drop-spot-inner'></div></section>

            {ff > -1 && content.map((c,index)=>{

            return(
            <>
            
                <div
                key={"bleid-" + index}
                id={"bleid-" + index}
                className='block'
                editable={props.editable ? "true" : "false"}
                draggable={props.editable && currentBlockId != index  ? "true" : "false"}
                onDragStart={(e)=>{handleDragStart(index);}}
                onDragEnd={(e)=>{handleDragEnd(e,index)}}
                >

                    <img 
                        id={"addeid-"+(index+1)}  
                        className='b-add'
                        src={addInd} 
                        draggable="false" 
                        enabled={creatingBlock == index+1 ? "true" : "false"}
                        onMouseEnter={(e)=>{handleBlockCreationOpen(e,index+1)}}
                        onWheel={()=>{setCreatingBlock(-1)}}
                      />

                    <img 
                        className='b-dragger' 
                        src={dragInd} 
                        draggable="false" 
                        enabled={creatingBlock == index+1 ? "true" : "false"}
                        onMouseEnter={()=>{setCreatingBlock(-1)}}/>
                    {
                    c.type == "img" ?
                    <>
                        <div className="img" onDrop={(e)=>{handleImageDrop(e,index)}}>
                            <img  id={"neid-" + index} src={c.url} />
                            <input placeholder={ props.editable ? getPlaceholder(c.type): ''}  disabled={!props.editable } value={c.text}  onChange={(e)=>{updateContent(e,index)}} />
                        </div>
                    </>
                    : c.type == "sep" ?
                    <>
                        <div className='separator'></div>
                    </>
                     : c.type == "cd" ?
                     <>
                         <div className='code'>
                        
                            <div className='cd-flex'>
                            <div className="cd-copy" ><img  onClick={(e)=>{handleCodeCopy(e,c.text)}} src={copyIcon}/>{lang.tr("Copy")}                 
                            {props.editable ? <>&nbsp;&nbsp;&nbsp;<img className={!c.cl ? 'cd-rot' : 'cd-collapse'} src={formatCode} onClick={()=>{invertCodeCL(index)}}/> {c.cl ? lang.tr("Expand") : lang.tr("Collapse")} </>: <></>}</div>
                                
                                <div>
                                {lang.tr("Language")}&nbsp;&nbsp;&nbsp;<select value={c.lang} onChange={(e)=>{updateCodeLang(e,index)}} disabled={!props.editable}>
                                    {codeLangs.map((l)=>{
                                        return <option key={"b-cd-"+l} value={l}>{l}</option>
                                    })}
                                </select>
                                </div>
                            </div>
                           
                            <CodeBlock 
                            editable={props.editable} 
                            value={c.text}
                            onChange={(e)=>{updateContent(e,index)}}
                            collapsed={c.cl}
                            language={c.lang}/>
                            
                            <div className='cd-logo'>POWERED BY C<img src={rubiumLogo} />DE MIRROR</div>
                         </div>
                         
                     </>
                    : c.type == "kb" ?
                    <>
                        <div className='kanban' editable={props.editable ? "true": "false"}>
                            <section><input  disabled={!props.editable } placeholder={props.editable ? lang.tr("Enter a title...") : ""} value={c.title} onChange={(e)=>{setKanbanTitle(index,e.target.value)}}/></section>
                            <section className="kb-lower">
                                <section onDragEnterCapture={()=>{setKanbanDragArea("backlog")}}>
                                    <h4>{lang.tr("Backlog")}</h4>
                                    {props.editable ? <input disabled={!props.editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{if(e.key == "Enter" && e.target.value !== ""){ addKanban("backlog",index,e.target.value); e.target.value = "";}}}/> : <></>}
                                    {<ul>
                                        {c.backlog.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={ index + "-td-task-" + idx} draggable={props.editable} onDragEnd={()=>{handleKanbanDrop(index,idx,"backlog")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                               
                                                {props.editable ? 
                                                <div>
                                                    {/* <img className="kb-rm rt180" src={arrowRight} /> */}
                                                    <img className="kb-rm" src={arrowRight} onClick={()=>{moveKanban(index,idx,"backlog","doing")}}/>
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{removeKanban("backlog",index,idx)}}/>
                                                </div> :<></> }       
                                            </li>
                                            
                                            </>
                                        })}
                                    </ul>}
                                </section>
                                <section onDragEnterCapture={()=>{setKanbanDragArea("doing")}}>
                                    <h4>{lang.tr("Doing")}</h4>
                                    {props.editable ? <input  disabled={!props.editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{if(e.key == "Enter" && e.target.value !== ""){ addKanban("doing",index,e.target.value); e.target.value = "";}}}/>: <></>}
                                    <ul>
                                    {c.doing.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={ index + "-dg-task-" + idx} draggable={props.editable} onDragEnd={()=>{handleKanbanDrop(index,idx,"doing")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                                {props.editable ? <div>
                                                    <img className="kb-rm rt180" src={arrowRight} onClick={()=>{moveKanban(index,idx,"doing","backlog")}}/>
                                                    <img className="kb-rm" src={arrowRight} onClick={()=>{moveKanban(index,idx,"doing","done")}} />
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{removeKanban("doing",index,idx)}}/>
                                                </div>:<></> }                                         
                                            </li>
                                            </>
                                        })}
                                    </ul>
                                </section>
                                <section onDragEnterCapture={()=>{setKanbanDragArea("done")}}>
                                    <h4>{lang.tr("Done")}</h4>
                                    {props.editable ? <input  disabled={!props.editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{if(e.key == "Enter" && e.target.value !== ""){ addKanban("done",index,e.target.value); e.target.value = "";}}}/>: <></>}
                                    <ul>
                                        {c.done.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={ index + "-dn-task-" + idx} draggable={props.editable} onDragEnd={()=>{handleKanbanDrop(index,idx,"done")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                                {props.editable ? <div>
                                                    <img className="kb-rm rt180" src={arrowRight} onClick={()=>{moveKanban(index,idx,"done","doing")}} />
                                                    {/* <img className="kb-rm" src={arrowRight} /> */}
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{removeKanban("done",index,idx)}}/>
                                                </div>   :<></> }                                          
                                            </li>
                                            </>
                                        })}
                                    </ul>
                                </section>
                            </section>
                        </div>
                    </>
                    : c.type == "ai" ?
                    <>
                        <div>{generated}</div>
                        <input value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){ generateContent()}}} placeholder={lang.tr("Enter Prompt")}/>
                    </>
                    : c.type == "p" ?
                    <>
                            <textarea className={c.type}
                            style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                            id={"neid-" + index} 
                            placeholder={ props.editable ? getPlaceholder(c.type): ''}
                            onFocus={()=>{setCurrentBlockId(index)}}
                            onMouseDown={()=>{setCurrentBlockId(index)}}
                            onSelectCapture={()=>{handleMouseUp();}}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                            onChange={(e)=>{updateContent(e,index)}}           
                            value={c.text}
                            disabled={!props.editable }
                            onBlur={()=>{setCurrentBlockId(-1)}}
                            rows={document.getElementById("neid-"+index) ? (document.getElementById("neid-"+index).scrollHeight / 22) : 1}
                            />
                    </>
                    :
                    <>
                            <input className={c.type}
                            style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                            id={"neid-" + index} 
                            placeholder={ props.editable ? getPlaceholder(c.type): ''}
                            onFocus={()=>{setCurrentBlockId(index)}}
                            onMouseDown={()=>{setCurrentBlockId(index)}}
                            onSelectCapture={()=>{handleMouseUp();}}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}}
                            onChange={(e)=>{updateContent(e,index);autoGrow(e)}}                
                            value={c.text}
                            disabled={!props.editable }
                            onBlur={()=>{setCurrentBlockId(-1)}}
                            />
                    </>
                }
                 {content.length > 1 ? <img 
                        className='b-remove'
                        src={removeInd} 
                        draggable="false" 
                        onClick={()=>{removeBlock(index)}}
                      /> : <></>}

                </div>
                <section 
                id={"drop-"+(index+1)}
                onDragOver={(e)=>{handleDropEnter(index+1)}}
                onDragLeave={(e)=>{handleDropLeave()}}
                drop-enabled={enabledDrop == index+1 ? "true" : "false" }
                className='drop-spot'
                onDrop={(e)=>{handleNewImageDrop(e,index+1)}}
                ><div className='drop-spot-inner'></div></section>
            </>)

        
        })}
       {props.editable ? <> 
       <div style={toolStyle} className="toolbar">
            <img src={formatH1} onClick={()=>{boldSelected()}}/>
            <img src={formatH2}/>
            <img src={formatP}/>
            <img src={formatImg}/>
        </div>
        { creatingBlock == -1 ? <></> : 
        <div 
            className="block-creator" 
            style={crtBlockStyle}             
            onMouseLeave={()=>{setCreatingBlock(-1)}}>

            <div onClick={()=>{addBlock("h1")}}>
                <img src={formatH1}/>
                <p>{lang.tr("Heading H1")}</p>
            </div>
            <div onClick={()=>{addBlock("h2")}}>
                <img src={formatH2}/>
                <p>{lang.tr("Heading H2")}</p>
            </div>
            <div onClick={()=>{addBlock("p")}}>
                <img src={formatP}/>
                <p>{lang.tr("Paragraph")}</p>
            </div>
            <div onClick={()=>{addBlock("img")}}>
                <img src={formatImg}/>
                <p>{lang.tr("Random Image")}</p>
            </div>
            <div onClick={()=>{addBlock("sep")}}>
                <img src={formatSep}/>
                <p>{lang.tr("Separator")}</p>
            </div>
            <div onClick={()=>{addBlock("kb")}}>
                <img src={formatKanban}/>
                <p>Kanban</p>
            </div>
            <div onClick={()=>{addBlock("cd")}}>
                <img src={formatCode}/>
                <p>Embed Code</p>
            </div>
        </div>}
         <div>
        </div> </>: <></>}
    </div>)
}

export default NoteEditor