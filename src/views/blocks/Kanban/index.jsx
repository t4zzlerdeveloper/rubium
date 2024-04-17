import './Kanban.css'

import removeInd from '../../../assets/delete.svg'
import { useEffect, useState } from 'react';
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';

function Kanban(props) {

    const user = useUser();
    //! Change translation to Kanban
    const lang = new LangTranslator("NoteEditor",user);

    const [editable,setEditable] = useState(false);
    const [content,setContent] = useState({type:"kb",title:"",backlog:[],doing:[],done:[]});

    const [ff,setFF] = useState(0);

    useEffect(()=>{
        if(props && props.content) setContent(props.content);
        if(props && props.editable) setEditable(props.editable);
    },[props]);


    const[kanbanDragArea,setKanbanDragArea] = useState(null);

    function handleDrop(idx,phase){
         if(kanbanDragArea) move(idx,phase,kanbanDragArea);
     }


    function propagateContent(newContent){
        setContent(newContent);
        setFF(ff+1);

        if(props && props.onContentChange) props.onContentChange(newContent);
    }


   function setTitle(newTitle){
    let copy = content;
    copy.title = newTitle;
    propagateContent(copy);
   }


   function add(phase,task){
        let copy = content;
        copy[phase].push(task);
        propagateContent(copy);
    }

   function move(idx,currentPhase,newPhase){
        let task = content[currentPhase].splice(idx,1);
        let copy = content;
        copy[newPhase].push(task);
        propagateContent(copy);
    }


    function remove(phase,idx){
        let copy = content;
        copy[phase].splice(idx,1);
        propagateContent(copy);
    }

    function handleTaskInputDown(e,phase){
        if(e.key == "Enter" && e.target.value !== ""){ 
            add(phase,e.target.value); 
            e.target.value = "";
        }
    }

    return (
        <>
        {ff > -1 ? <>
         <div className='kanban' editable={editable ? "true": "false"}>
                            <section><input  disabled={!editable } placeholder={editable ? lang.tr("Enter a title...") : ""} value={content.title} onChange={(e)=>{setTitle(e.target.value)}}/></section>
                            <section className="kb-lower">
                                <section >
                                    <h4>{lang.tr("Backlog")}</h4>
                                    {editable ? <input disabled={!editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{handleTaskInputDown(e,"backlog")}}/> : <></>}
                                    <ul onDragEnterCapture={()=>{setKanbanDragArea("backlog")}}>
                                        {content.backlog.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={"td-task-" + idx} draggable={editable} onDragEnd={()=>{handleDrop(idx,"backlog")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                               
                                                {editable ? 
                                                <div>
                                                    {/* <img className="kb-rm rt180" src={arrowRight} /> */}
                                                    {/* <img className="kb-rm" src={arrowRight} onClick={()=>{move(idx,"backlog","doing")}}/> */}
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{remove("backlog",idx)}}/>
                                                </div> :<></> }       
                                            </li>
                                            
                                            </>
                                        })}
                                    </ul>
                                </section>
                                <section >
                                    <h4>{lang.tr("Doing")}</h4>
                                    {editable ? <input  disabled={!editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{handleTaskInputDown(e,"doing")}}/>: <></>}
                                    <ul onDragEnterCapture={()=>{setKanbanDragArea("doing")}}>
                                    {content.doing.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={"dg-task-" + idx} draggable={editable} onDragEnd={()=>{handleDrop(idx,"doing")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                                {editable ? <div>
                                                    {/* <img className="kb-rm rt180" src={arrowRight} onClick={()=>{move(idx,"doing","backlog")}}/> */}
                                                    {/* <img className="kb-rm" src={arrowRight} onClick={()=>{move(idx,"doing","done")}} /> */}
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{remove("doing",idx)}}/>
                                                </div>:<></> }                                         
                                            </li>
                                            </>
                                        })}
                                    </ul>
                                </section>
                                <section >
                                    <h4>{lang.tr("Done")}</h4>
                                    {editable ? <input  disabled={!editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{handleTaskInputDown(e,"done")}}/>: <></>}
                                    <ul onDragEnterCapture={()=>{setKanbanDragArea("done")}}>
                                        {content.done.map((task,idx)=>{
                                            return <>
                                             <li className="kb-task" key={"dn-task-" + idx} draggable={editable} onDragEnd={()=>{handleDrop(idx,"done")}}>
                                             <p className="kb-name"><a className='kb-due'>{lang.tr("No deadline")}</a><br/>{task}</p>
                                                {editable ? <div>
                                                    {/* <img className="kb-rm rt180" src={arrowRight} onClick={()=>{move(idx,"done","doing")}} /> */}
                                                    {/* <img className="kb-rm" src={arrowRight} /> */}
                                                    <img className="kb-rm" src={removeInd} onClick={()=>{remove("done",idx)}}/>
                                                </div>   :<></> }                                          
                                            </li>
                                            </>
                                        })}
                                    </ul>
                                </section>
                            </section>
                        </div>
            </> : <></>}
        </>
    )

}

export default Kanban