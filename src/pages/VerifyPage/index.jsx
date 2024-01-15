import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { account } from '../../lib/appwrite';

function VerifyPage(){

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [text,setText] = useState("Verifying...");

    useEffect(()=>{
        const userId = searchParams.get("userId")
        const secret = searchParams.get("secret")

        account.updateVerification(userId,secret)
        .then((res)=>{
            setText("Verified Sucessfully! Redirecting...")
            setTimeout(()=>{
                navigate("/app");
            },1000)
        })
        .catch(()=>{
            setText("This link is invalid or has expired!")
        })
    },[])

    return (<>
        {text}
    </>)
}

export default VerifyPage;
