import './NoPage.css'

import rubium from '../../assets/rubium-logomark.svg'
import noBack from '../../assets/no-back.jpg'
import { useNavigate } from 'react-router-dom'
import LangTranslator from '../../lib/context/language'
import { useUser } from '../../lib/context/user'



function NoPage(){
    const navigate = useNavigate();

    const user = useUser();
    const lang = new LangTranslator("NoPage",user);

    return (<>
    
    <div className='no-page'>
        <div className='no-page-404'>
        
        <h1>4</h1><div><img src={rubium}/></div><h1>4</h1>
    
        </div>
        <h1>{lang.tr("Looks like you got lost. This page does not exist...")}</h1>
        <button onClick={()=>{navigate("/")}}>{lang.tr("Go to Home Page")}</button>
    </div>
    <div className="no-back" style={{background: `url(${noBack})`,backgroundSize:"cover"}}></div>
    </>)
}

export default NoPage