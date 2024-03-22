import { useEffect } from 'react'
import './OAuth2.css'
import { useUser } from '../../lib/context/user';
import { useNavigate } from 'react-router-dom';



function OAuth2(){

    const user = useUser();
    const navigate = useNavigate();
    useEffect(()=>{
        const status = window.location.pathname.replace("/auth/oauth2/","");
        if(status.startsWith("success")){
            navigate("/app");
        }
        setTimeout(()=>{
            navigate("/login");
        },5000)
    },[])


    return(<>
        {"Sorry but an error ocurred while authenticating your account, please try again and make sure you have 3rd party cookies enabled on your browser... Redirecting back..."}
    </>)
}

export default OAuth2