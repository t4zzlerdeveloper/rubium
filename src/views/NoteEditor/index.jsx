import { useEffect, useState } from 'react'
import './NoteEditor.css'


import formatH1 from '../../assets/format_h1.svg'
import formatH2 from '../../assets/format_h2.svg'
import formatH3 from '../../assets/format_h3.svg'
import formatP from '../../assets/format_p.svg'
import formatImg from '../../assets/image.svg'
import formatSep from '../../assets/separator.svg'
import formatKanban from '../../assets/kanban.svg'
import formatCode from '../../assets/code.svg'


import addInd from '../../assets/add.svg'
import removeInd from '../../assets/delete.svg'
import dragInd from '../../assets/drag_indicator.svg'

import LangTranslator from '../../lib/context/language'


import { useUser } from '../../lib/context/user'
import Kanban from '../blocks/Kanban'
import Paragraph from '../blocks/Paragraph'
import Code from '../blocks/Code'
import Heading from '../blocks/Heading'
import Image from '../blocks/Image'

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
            initialContent = {
                type:type,
                text : "",
                url : ""
            }
        }


        if(type == "cd"){
            initialContent = {
                type:type,
                text:"",
                lang:"JavaScript",
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


    function updateBlock(newContent,index){
        let copy = content;
        copy[index] = newContent;
        setContent(copy);
        setFF(ff+1)
    }

    


    const [toolStyle,setToolStyle] = useState({display:"none"});
    const [currentBlockId,setCurrentBlockId] = useState(null);

    function handleMouseUp(){
    //TODO: fix tool position
    //     let a = document.getElementById("neid-"+currentBlockId)
    //     let left = a.selectionStart;
    //     let width = a.selectionEnd-a.selectionStart;
    //     console.log(left,width)
    
    //     let selection = window.getSelection(),
    //     selectionRect = a.getBoundingClientRect();
         
    //     if(width == 0 || !props.editable) {setToolStyle({display:"none"}); return;}
    
    //    setToolStyle({
    //       top: selectionRect.top - 42 + 'px',
    //       left: ( selectionRect.left + (left * 7) +  (width * 3.5)) + 'px'
    //     });
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

        const offset = 282;

        if(rect.top > window.innerHeight -offset){
            //!fix size to dynamic
            setCrtBlockStyle(
                {
                    top:rect.top - offset,
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


    function updateUrl(index,url,alt){
        let copy = content;
        copy[index].url = url;
        copy[index].text = alt;
        setContent(copy);
        setFF(ff+1)
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
                style={props.editable ? null : {cursor: "default"}}
                editable={props.editable ? "true" : "false"}
                draggable={props.editable  ? "true" : "false"}
                onDragStart={(e)=>{handleDragStart(index);}}
                onDragEnd={(e)=>{handleDragEnd(e,index)}}
                >

                    <img 
                        id={"addeid-"+(index+1)}  
                        className='b-add'
                        style={props.editable ? null : {cursor: "default"}}
                        src={addInd} 
                        draggable="false" 
                        enabled={creatingBlock == index+1 ? "true" : "false"}
                        onMouseEnter={(e)=>{handleBlockCreationOpen(e,index+1)}}
                        onWheel={()=>{setCreatingBlock(-1)}}
                      />

                    <img 
                        className='b-dragger' 
                        src={dragInd} 
                        style={props.editable ? null : {cursor: "default"}}
                        draggable="false" 
                        enabled={creatingBlock == index+1 ? "true" : "false"}
                        onMouseEnter={()=>{setCreatingBlock(-1)}}/>
                    {
                    c.type == "img" ?
                    <>
                       <Image
                        index={index}
                        editable={props.editable}
                        content={c}
                        onContentChange={(newContent)=>updateBlock(newContent,index)}
                       />
                    </>
                    : c.type == "sep" ?
                    <>
                        <div className='separator'></div>
                    </>
                     : c.type == "cd" ?
                     <>
                         <Code
                            index={index}
                            editable={props.editable}
                            content={c}
                            onContentChange={(newContent)=>updateBlock(newContent,index)}
                         />
                         
                     </>
                    : c.type == "kb" ?
                    <>
                      <Kanban 
                        index={index}
                        editable={props.editable}
                        content={c}
                        onContentChange={(newContent)=>updateBlock(newContent,index)}
                      />
                    </>
                    : c.type == "p" ?
                    <>
                            <Paragraph
                            index={index}
                            editable={props.editable}
                            content={c}
                            onContentChange={(newContent)=>updateBlock(newContent,index)}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}}
                            onMouseUp={()=>{handleMouseUp()}}
                            setCurrentBlockId={(id)=>{setCurrentBlockId(id)}}
                            />
                    </>
                    :
                    <>
                           <Heading
                            index={index}
                            editable={props.editable}
                            content={c}
                            onContentChange={(newContent)=>updateBlock(newContent,index)}
                            onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}}
                            onMouseUp={()=>{handleMouseUp()}}
                            setCurrentBlockId={(id)=>{setCurrentBlockId(id)}}
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
       <> 
       <div style={props.editable ? toolStyle : null} className={props.editable ? "toolbar" :"nulltoolbar"}>
            <img src={props.editable ? formatH1 : null} onClick={()=>{boldSelected()}}/>
            <img src={props.editable ? formatH2 : null}/>
            <img src={props.editable ? formatP : null}/>
            <img src={props.editable ? formatImg : null}/>
        </div>
        
        <div 
            className={props.editable ? "block-creator" :"nullblock-creator"} 
            style={creatingBlock == -1 ? {display: "none"} : crtBlockStyle}             
            onMouseLeave={()=>{setCreatingBlock(-1)}}>

            <div onClick={()=>{addBlock("h1")}}>
                <img src={formatH1}/>
                <p>{lang.tr("Heading H1")}</p>
            </div>
            <div onClick={()=>{addBlock("h2")}}>
                <img src={formatH2}/>
                <p>{lang.tr("Heading H2")}</p>
            </div>
            <div onClick={()=>{addBlock("h3")}}>
                <img src={formatH3}/>
                <p>{lang.tr("Heading H3")}</p>
            </div>
            <div onClick={()=>{addBlock("p")}}>
                <img src={formatP}/>
                <p>{lang.tr("Paragraph")}</p>
            </div>
            <div onClick={()=>{addBlock("img")}}>
                <img src={formatImg}/>
                <p>{lang.tr("Image")}</p>
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
        </div>
         <div>
        </div> </>
    </div>)
}

export default NoteEditor