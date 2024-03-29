import { useEffect, useState } from 'react'
import './Toast.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import LangTranslator from '../../lib/context/language'
import { useUser } from '../../lib/context/user'



function Toast(props){

    const user = useUser();
    const lang = new LangTranslator("Toast",user);

    return(<>
     <div id="toast" className={props.type ? props.type : ""}><img id="img" src={rubiumLogo} /><div id="desc">{props.message || lang.tr("We're sorry but an error occured!")}</div></div>
    </>)
}

export default Toast
