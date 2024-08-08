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
                    </div>

                    <div>
                        <h5>{lang.tr("Due Date")}</h5>
                        <input 
                        className='tkd-due-date'
                        type="datetime-local"
                        onChange={(e)=>{props.onDueDateChange(e.target.value)}}/>

            
        
                            <h5>{lang.tr("Assignees")}</h5>
                            {props.sharedUsers ? <div className='tkd-assignees'>
                                {props.sharedUsers.map(l => {
                                    return <div key={l.name} className='tkd-user'>
                                        <img src={avatars.getInitials(l.name)} />
                                        <p>{l.email}</p>
                                    </div>
                                })}
                            </div> : <Loader/>}
        
                  
                    </div>

                </div>
                
            
            <div>
                <button
                className='tkd-delete-btn'
                 onClick={()=>{props.onDelete();handleClose();}}>Delete Task</button>
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