import { useEffect, useState } from "react"
import { useUser } from "../../lib/context/user";
import { useNavigate } from "react-router-dom";

import { account } from "../../lib/appwrite";
import LoadingPage from "../../pages/LoadingPage";


function RequireAuth(props){

    const user = useUser();
    const navigate = useNavigate();

    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        account.get().then((res)=>{
            if(!res) navigate("/login");
            setLoading(false);
        }).catch((err)=>{
            navigate("/login");
            setLoading(false);
        });      
       
    },[user])
    
    return(<>
        {loading ? <LoadingPage/> : props.children}
    </>)
}

export default RequireAuth