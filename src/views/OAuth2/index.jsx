import { useEffect } from 'react'
import './OAuth2.css'
import { useUser } from '../../lib/context/user';
import { useNavigate } from 'react-router-dom';



function OAuth2(){

    const user = useUser();
    const navigate = useNavigate();
    useEffect(()=>{
        const status = window.location.pathname.replace("/auth/oauth2/","");
        if(status == "success"){
           
        }
    },[])


    return(<>
        {user && user.current ? JSON.stringify(user.current) : "No user"}
    </>)
}

export default OAuth2