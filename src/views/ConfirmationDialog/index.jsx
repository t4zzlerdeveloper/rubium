import { useEffect, useState } from 'react'
import './ConfirmationDialog.css'

function ConfirmationDialog (props){

    const[confirmed,setConfirmed] = useState(false);

    useEffect(()=>{
        if(props.display) setConfirmed(false);
    },[props.display])

    return(<>
        <div className={props.display && !confirmed ? 'conf-dialog' : 'conf-dialog-hidden' }>
            <div>
                <h4>{props.title ? props.title : "Confirmation"}</h4>
                <p>{props.text ? props.text : "Are you sure you want to do that?"}</p>
                <div>
                    <button className="conf-can-btn" onClick={()=>{props.handleCancelation();setConfirmed(true)}}>{props.cancelText ?  props.cancelText : "Cancel"}</button>
                    <button className="conf-btn" onClick={()=>{props.handleConfirmation();setConfirmed(true)}}>{props.confirmText ? props.confirmText :  "Confirm"}</button>
                </div>
            </div>
        </div>
    </>)
}

export default ConfirmationDialog