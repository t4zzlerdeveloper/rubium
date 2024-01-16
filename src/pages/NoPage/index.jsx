import './NoPage.css'

import rubium from '../../assets/rubium-logomark.svg'
import noBack from '../../assets/no-back.jpg'
import { useNavigate } from 'react-router-dom'

function NoPage(){
    const navigate = useNavigate();

    return (<>
    
    <div className='no-page'>
        <div className='no-page-404'>
        
        <h1>4</h1><div><img src={rubium}/></div><h1>4</h1>
    
        </div>
        <h1>Looks like you got lost. This page does not exist...</h1>
        <button onClick={()=>{navigate("/")}}>Go to Home Page</button>
    </div>
    <div className="no-back" style={{background: `url(${noBack})`,backgroundSize:"cover"}}></div>
    </>)
}

export default NoPage