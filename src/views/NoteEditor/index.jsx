import { useEffect, useState } from 'react'
import './NoteEditor.css'

import formatH1 from '../../assets/format_h1.svg'
import formatH2 from '../../assets/format_h2.svg'
import formatP from '../../assets/format_p.svg'

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

    const initialContent = props.content ? JSON.parse(props.content) : [];

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
        setEnabledDrop(index)
    }
    
    function handleDragStart(index){
        setBlockDragging(index);
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
            ><div className='drop-spot-inner'></div></section>

            {ff > -1 && content.map((c,index)=>{

            return(
            <>
            
                <div
                key={"bleid-" + index}
                id={"bleid-" + index}
                className='block'
                editable={props.editable ? "true" : "false"}
                draggable={props.editable ? "true" : "false"}
                onDragStart={(e)=>{handleDragStart(index);}}
                onDragEnd={(e)=>{handleDragEnd(e,index)}}
                >
                    <img className='b-dragger' src={dragInd} draggable="false"/>
                    {
                    c.type == "img" ?
                    <>
                        <div className="img"><img  id={"neid-" + index} src={c.url} /><p>{c.text}</p></div>
                    </>
                    : c.type == "ai" ?
                    <>
                        <div>{generated}</div>
                        <input value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){ generateContent()}}} placeholder="Enter Prompt"/>
                    </>
                    :
                    <>
                             {/* //! Fix cant select text */}
                            <input className={c.type}
                            style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                            id={"neid-" + index} 
                            onFocus={()=>{setCurrentBlockId(index)}}
                            onSelectCapture={()=>{handleMouseUp();}}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                            onChange={(e)=>{updateContent(e,index)}}                
                            value={c.text}
                            draggable={props.editable ? "true" : "false"}
                            onDragStart={event => event.preventDefault()}
                            />
                    </>
                }
                </div>
                <section 
                id={"drop-"+(index+1)}
                onDragOver={(e)=>{handleDropEnter(index+1)}}
                onDragLeave={(e)=>{handleDropLeave()}}
                drop-enabled={enabledDrop == index+1 ? "true" : "false" }
                className='drop-spot'
                ><div className='drop-spot-inner'></div></section>
            </>)

        
        })}
        <div style={toolStyle} class="toolbar">
            <img src={formatH1} onClick={()=>{boldSelected()}}/>
            <img src={formatH2}/>
            <img src={formatP}/>
        </div>
        <div>
        <select name="type" id="blockType">
            <option value="h1">Heading H1</option>
            <option value="h2">Heading H2</option>
            <option value="p">Paragraph</option>
        </select>
            <button onClick={()=>{
                setContent([...content,{
                    type: document.getElementById("blockType").value,
                    text:""
                }])
            }}>+ Add</button>
        </div>
    </div>)
}

export default NoteEditor