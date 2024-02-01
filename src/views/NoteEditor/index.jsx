import { useEffect, useState } from 'react'
import './NoteEditor.css'

import formatH1 from '../../assets/format_h1.svg'
import formatH2 from '../../assets/format_h2.svg'
import formatP from '../../assets/format_p.svg'
import formatImg from '../../assets/image.svg'

import addInd from '../../assets/add.svg'
import removeInd from '../../assets/delete.svg'
import dragInd from '../../assets/drag_indicator.svg'


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GOOGLE_API_KEY);


const dummyContent = [
    {
        type:"h1",
        text:"H1 block",
        underline:true,
    },
    {
        type:"h2",
        text:"Another H2 block"
    },
    {
        type:"img",
        text:"unsplash.it random image ",
        url:"https://unsplash.it/130/193"
    },
    {
        type:"p",
        text:"This is just some <b>bold text</b> that you can see as a <p/> object"
    },
    {
        type:'ai'
    }

]


function NoteEditor(props){

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

        if(type =="img"){
            const x = Math.round(Math.random() * 300) + 200;
            const y = Math.round(Math.random() * 300) + 200;
            initialContent = {
                type:type,
                text : alt ? alt :`Enter an image caption.`,
                url : url ? url : `//unsplash.it/${x}/${y}`
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

    function updateUrl(index,newUrl,newText){
        let copy = content;
        copy[index].url = newUrl;
        copy[index].text = newText;
        setContent(copy);
        setFF(ff+1)
    }


    const [toolStyle,setToolStyle] = useState({});
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

        if(rect.top > window.innerHeight -200){
            //!fix size to dynamic
            setCrtBlockStyle(
                {
                    top:rect.top - 150,
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
                            <input  disabled={!props.editable } value={c.text}  onChange={(e)=>{updateContent(e,index)}} />
                        </div>
                    </>
                    : c.type == "ai" ?
                    <>
                        <div>{generated}</div>
                        <input value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){ generateContent()}}} placeholder="Enter Prompt"/>
                    </>
                    :
                    <>
                             {/* //! Fix cant select text */ }
                            <input className={c.type}
                            style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                            id={"neid-" + index} 
                            onFocus={()=>{setCurrentBlockId(index)}}
                            onMouseDown={()=>{setCurrentBlockId(index)}}
                            onSelectCapture={()=>{handleMouseUp();}}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                            onChange={(e)=>{updateContent(e,index)}}                
                            value={c.text}
                            disabled={!props.editable }
                            onBlur={()=>{setCurrentBlockId(-1)}}
                            />
                    </>
                }
                 <img 
                        className='b-remove'
                        src={removeInd} 
                        draggable="false" 
                        onClick={()=>{removeBlock(index)}}
                      />

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
                <p>Heading H1</p>
            </div>
            <div onClick={()=>{addBlock("h2")}}>
                <img src={formatH2}/>
                <p>Heading H2</p>
            </div>
            <div onClick={()=>{addBlock("p")}}>
                <img src={formatP}/>
                <p>Paragraph</p>
            </div>
            <div onClick={()=>{addBlock("img")}}>
                <img src={formatImg}/>
                <p>Random Image</p>
            </div>
        </div>}
         <div>
        </div> </>: <></>}
    </div>)
}

export default NoteEditor