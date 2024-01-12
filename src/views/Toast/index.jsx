import { useEffect, useState } from 'react'
import './Toast.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'

function Toast(props){


    return(<>
     <div id="toast" className={props.type ? props.type : ""}><img id="img" src={rubiumLogo} /><div id="desc">{props.message || "We're sorry but an error occured!"}</div></div>
    </>)
}

export default Toast
