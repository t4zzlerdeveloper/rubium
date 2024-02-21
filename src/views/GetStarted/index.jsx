import './GetStarted.css'

import rubiumLogo from '../../assets/rubium-logomark.svg'
import { useUser } from '../../lib/context/user'
import LangTranslator from '../../lib/context/language';
import { useState } from 'react';

function GetStarted(props) {

    const user = useUser();
    const lang = new LangTranslator("GetStarted",user);

    const [noteTitle, setNoteTitle] = useState("");

    return(<div className='get-started'>
        <div className='gs-main'>
            <div className='gs-left'>
                <h1>{lang.tr("Start your journey with")} <b>Rubium</b></h1>
                <img src={rubiumLogo}/>
            </div>
          <div></div>
          <div></div>
            <div className='gs-right'>
                <h3>{lang.tr("What are you taking notes of today?")}</h3>
                <input placeholder={lang.tr("Answer here...")} value={noteTitle} onChange={(e)=>{setNoteTitle(e.target.value)}}></input>
                <button onClick={()=>{props.onStart(noteTitle)}}>{lang.tr("Get Started")}</button>
            </div>
        </div>
    </div>)
}

export default GetStarted