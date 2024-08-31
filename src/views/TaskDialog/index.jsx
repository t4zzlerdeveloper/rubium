import { useEffect, useState } from 'react';
import './TaskDialog.css'

import { useUser } from '../../lib/context/user';

import closeIcon from '../../assets/close.svg'
import Loader from '../Loader';
import LangTranslator from '../../lib/context/language';

import { avatars } from '../../lib/appwrite'


function TaskDialog(props){
  
  const user = useUser();
  const lang = new LangTranslator("TaskDialog",user);

  const [confirmed,setConfirmed] = useState(false);

    useEffect(()=>{
        if(props.display) {
            setConfirmed(false);
        }
    },[props.display])


    const[saving,setSaving] = useState(false);

    const[currentAssignee,setCurrentAssignee] = useState(user.current);


    function handleClose(){
        props.onClose();setConfirmed(true)
    }

    return(<>
        <div className={props.display && !confirmed ? 'task-dialog' : 'task-dialog-hidden' }>
            <div>
                <div className="tkd-top" >
                    <h4>{props.task}</h4>
                    <img  onClick={()=>{handleClose()}} src={closeIcon}/>
                </div>

                <div className="tkd-middle">

                    <div>
                        <h5>{lang.tr("Description")}</h5>
                        <textarea
                        className='tkd-description'
                        onChange={(e)=>{props.onDescriptionChange(e.target.value)}}
                        placeholder={lang.tr("Add a description...")}
                        value={props.description}/>

                        <div>
                            <br></br>
                                <button
                                className='tkd-delete-btn'
                                onClick={()=>{props.onDelete();handleClose();}}>{lang.tr("Delete Task")}</button>
                            </div>
                    </div>

                    <div>
                        <h5>{lang.tr("Due Date")}</h5>
                        <input 
                        className='tkd-due-date'
                        type="datetime-local"
                        onChange={(e)=>{props.onDueDateChange(e.target.value)}}/>

            
        
                            <h5>{lang.tr("Assignee")}</h5>
                            <div className='tkd-selector-div'>
                                <div className='tkd-cur-assignee'>
                                    <div key={currentAssignee} className='tkd-user'>
                                            <img src={avatars.getInitials(currentAssignee.name)} />
                                            <p>{ user.current.email == currentAssignee.email ? <>{lang.tr("Me") + " (" + currentAssignee.name + ")"}</> :  <>{(currentAssignee.name + " (" + currentAssignee.email + ")")}</>}</p>
                                        </div>
                                </div>
                
                                {props.sharedUsers ? <div className='tkd-assignees'>
                                    {user.current && <div key={user.current.name} className='tkd-user' onClick={()=>{setCurrentAssignee(user.current)}}>
                                            <img src={avatars.getInitials(user.current.name)} />
                                            <p><>{lang.tr("Me") + " (" + user.current.name + ")"}</></p>
                                        </div>}
                                    {props.sharedUsers.map(l => {
                                        return <div key={l.name} className='tkd-user' onClick={()=>{setCurrentAssignee({
                                            name:l.name,
                                            email:l.email
                                        })}}>
                                            <img src={avatars.getInitials(l.name)} />
                                            <p>{l.name + " (" + l.email + ")"}</p>
                                        </div>
                                    })}
                                </div> : <Loader/>}
                            </div>

                           
        
                  
                    </div>

                </div>
                
            
           
                
            {/* <div className='tkd-right'>
              {saving ? <Loader/> : 
              <button onClick={()=>{}}>{lang.tr("Save Changes")}</button>}
            </div> */}
              
                   
            </div>
        </div>
    </>)
}

export default TaskDialog