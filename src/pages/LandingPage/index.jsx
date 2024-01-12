import { useNavigate } from 'react-router'
import './LandingPage.css'

function LandingPage(){

    const navigate = useNavigate();
    return (<>
    This page is still under development.
    <button onClick={()=>{navigate("/app")}}>Jump to App</button>

    </>)
}

export default LandingPage