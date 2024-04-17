import './PricingPage.css'

import rubium from '../../assets/rubium-logomark.svg'
import noBack from '../../assets/pricing.webp'
import { useNavigate } from 'react-router-dom'
import LangTranslator from '../../lib/context/language'
import { useUser } from '../../lib/context/user'



function PricingPage(){
    const navigate = useNavigate();

    const user = useUser();
    const lang = new LangTranslator("PricingPage",user);

    return (<>
    
    <div className='price-page'>
        <div className='pricing-page'>
        
        <h1>{lang.tr("Oops looks like")} <b>{lang.tr("Pricing")}</b> {lang.tr("is not available")}
            <br></br> {lang.tr("because")} <a>Rubium</a> {lang.tr("is free")} :)</h1>
    
        </div>
        <div className='price-con'>
            <h1>{lang.tr("Notes Should Only Cost Time.")}</h1>
            <button onClick={()=>{navigate("/")}}>{lang.tr("Go to Home Page")}</button>
        </div>
      
    </div>
    <div className="pricing-back" style={{background: `url(${noBack})`,backgroundSize:"cover",backgroundPositionY:"100%"}}></div>
    </>)
}

export default PricingPage