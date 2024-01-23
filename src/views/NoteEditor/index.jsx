import { useEffect, useState } from 'react'
import './NoteEditor.css'

import formatH1 from '../../assets/format_h1.svg'
import formatH2 from '../../assets/format_h2.svg'
import formatP from '../../assets/format_p.svg'


function NoteEditor(){

    const [ff,setFF] = useState(0);

    const [content,setContent] = useState([
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
            type:"p",
            text:"This is just some text that you can see as a <p/> object"
        },

    ])

    useEffect(()=>{
        document.getElementById("neid-"+(content.length-1)).focus();
    },[content])


    function swapBlocks(x,y){
        let ctCopy = content;
        var b = ctCopy[x];
        ctCopy[x] = ctCopy[y];
        ctCopy[y] = b;
        setContent(ctCopy);
        setFF(ff+1);
    }

    function remove

    function handleKeyDown(e,index,type){

        
        if(e.key == "ArrowUp" && index >= 1){
            index--;
        }
        else if(e.key == "ArrowDown" && index <= content.length-2){
            index++;
        }
        else if(e.key == "Backspace"){
            // e.preventDefault();
            // index++;
        }
        else if(e.key == "Enter" && (type =="h1" || type == "h2")){
            e.preventDefault();
            index++;
        }
        else if(e.key == "ArrowLeft" && index >= 1){
            swapBlocks(index,index-1)
        }
        else if(e.key == "ArrowRight" && index <= content.length-2){
            swapBlocks(index,index+1)
        }
        document.getElementById("neid-"+index).focus();
       
    }


    const [toolStyle,setToolStyle] = useState({});

    function handleMouseUp(){
        let selection = window.getSelection(),
        getRange      = selection.getRangeAt(0),
        selectionRect = getRange.getBoundingClientRect();
         
        if(getRange == 0) {setToolStyle({display:"none"}); return;}
    
       setToolStyle({
          top: selectionRect.top - 42 + 'px',
          left: ( selectionRect.left + (selectionRect.width * 0.5)) + 'px'
        });
    }

    return (<div className='note-editor'>
        {ff > -1 && content.map((c,index)=>{
            return<> <c.type 
                style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                id={"neid-" + index} 
                onMouseMove={()=>{handleMouseUp()}}
                onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                contentEditable={true} dangerouslySetInnerHTML={{__html: c.text || ""}}>
                </c.type>
                </>
        })}
        <div style={toolStyle} class="toolbar">
            <img src={formatH1}/>
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