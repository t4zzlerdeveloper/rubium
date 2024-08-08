import './Kanban.css'

import removeInd from '../../../assets/delete.svg'
import personImg from '../../../assets/person.svg'
import { useEffect, useState } from 'react';
import LangTranslator from '../../../lib/context/language';
import { useUser } from '../../../lib/context/user';

import { avatars,} from '../../../lib/appwrite';
import TaskDialog from '../../TaskDialog';


function Kanban(props) {

    const user = useUser();
    const lang = new LangTranslator("Kanban",user);

    const [content,setContent] = useState({type:"kb",title:"",backlog:[],doing:[],done:[]});
    const [index,setIndex] = useState(props.index);

    const [ff,setFF] = useState(0);

    useEffect(()=>{
        if(props && props.content){ setContent(props.content); }
        if(props && props.index) setIndex(props.index)
        setFF(ff+1);
    }
    ,[props]);


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
    if (newTitle.length > 72) return;
    let copy = content;
    copy.title = newTitle;
    propagateContent(copy);
   }


   function add(phase,task){
        let copy = content;
        copy[phase].push(task); //TODO:convert stringTask to task
        propagateContent(copy);
    }

   function move(idx,currentPhase,newPhase){
        if(currentPhase == newPhase) return;

        let task = content[currentPhase].splice(idx,1)[0];
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


    const [openedTask,setOpenedTask] = useState(null);
    const [displayOpenedTask,setDisplayOpenedTask] = useState(false);

    function openTask(task,idx,phase){
        setOpenedTask({task:task,idx:idx,phase:phase});
        setDisplayOpenedTask(true);
    }

    function handleDueDateChange(idx,phase,date){
        let copy = content;
        copy[phase][idx].date = date;
        propagateContent(copy);
    }

    function convertStringTaskToTask(task){
        return {title:task,due:null,ass:[user.current.$id],desc:""};
    }

    
    const columns = [
        { title: lang.tr("Backlog"), tasks: content.backlog, area: "backlog" },
        { title: lang.tr("Doing"), tasks: content.doing, area: "doing" },
        { title: lang.tr("Done"), tasks: content.done, area: "done" },
    ];


    return (
        <>
        {ff > -1 ? <>
        <TaskDialog 
            noteId={props.noteId}
            display={displayOpenedTask} 
            sharedUsers={props.sharedUsers}
            loadingUsers={props.loadingUsers}
            task={openedTask && openedTask.task}
            onDueDateChange={(date)=>{handleDueDateChange(openedTask.idx,openedTask.phase,date)}}
            onDelete={()=>{remove(openedTask.phase,openedTask.idx);}}
            onClose={()=>{setDisplayOpenedTask(false)}}
        />

         <div key={"kb-" + index} className='kanban' editable={props.editable ? "true": "false"}>
                            <section ><input id={"kb-title-" + index} disabled={!props.editable } placeholder={props.editable ? lang.tr("Enter a title...") : ""} value={content.title} onChange={(e)=>{setTitle(e.target.value)}}/></section>
                            <section className="kb-lower">
                                {columns.map((column, idx) =>{
                                    return  <section >
                                    <h4>{column.title}</h4>
                                    {props.editable ? <input disabled={!props.editable } placeholder={lang.tr("New Task...")} onKeyDown={(e)=>{handleTaskInputDown(e,column.area)}}/> : <></>}
                                    <ul onDragEnterCapture={()=>{setKanbanDragArea(column.area)}}>
                                        {column.tasks.map((task,idx)=>{
                                            return <>
                                            
                                                <li 
                                                className={"kb-task" + (props.editable ? "" : " kb-view") }
                                                key={"td-task-" + idx} draggable={props.editable} 
                                                onDragEnd={()=>{handleDrop(idx,column.area)}}
                                                onClick={()=>{if(props.editable) openTask(task,idx,column.area)}}
                                                >
                                                <p className="kb-name"><a className='kb-due' >{lang.tr("No deadline")}</a><br/>{task}</p>
                                                
                                                <div>                       
                                                    <img className='kb-profile' src={ user.current ? avatars.getInitials(user.current.name) : personImg} />     
                                                    {/* {props.editable ? <img className="kb-rm" src={removeInd} onClick={()=>{remove(column.area,idx)}}/> :<></> }                                              */}
                                                </div>  

                                            </li>
                                            
                                            </>
                                        })}
                                    </ul>
                                </section>
                                })}
                               
                            </section>
                        </div>
            </> : <></>}
        </>
    )

}

export default Kanban