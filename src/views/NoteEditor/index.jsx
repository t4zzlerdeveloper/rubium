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
            text:"This is just some <b>bold text</b> that you can see as a <p/> object"
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
            
            // index++;
            if( document.getElementById("neid-"+index).value == ""){
                e.preventDefault();
                removeBlock(index)
            }
          
        }
        else if(e.key == "Enter" && (type =="h1" || type == "h2")){
            e.preventDefault();
            index++;
        }
        else if(e.key == "ArrowLeft" && index >= 1){
            //swapBlocks(index,index-1)
        }
        else if(e.key == "ArrowRight" && index <= content.length-2){
            //swapBlocks(index,index+1)
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
        console.log(content)
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
         
        if(width == 0) {setToolStyle({display:"none"}); return;}
    
       setToolStyle({
          top: selectionRect.top - 42 + 'px',
          left: ( selectionRect.left + (left * 7) +  (width * 3.5)) + 'px'
        });
    }

    return (<div className='note-editor'>
        {ff > -1 && content.map((c,index)=>{
            return<> <input className={c.type}
                style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                id={"neid-" + index} 
                onFocus={()=>{setCurrentBlockId(index)}}
                onSelectCapture={()=>{handleMouseUp();}}
                onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                onChange={(e)=>{updateContent(e,index)}}                
                value={c.text}/>
                </>

            return<> <c.type
                style={{textDecoration:c.underline ? "underline" : "",color:c.color || ""}} 
                id={"neid-" + index} 
                onFocus={()=>{setCurrentBlockId(index)}}
                onMouseMove={()=>{handleMouseUp();}}
                onKeyDown={(e)=>{handleKeyDown(e,index,c.type)}} 
                onKeyUp={(e)=>{updateContent(e,index)}}
                contentEditable={true} 
                dangerouslySetInnerHTML={{__html: c.text || ""}}>
                </c.type>
                </>
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