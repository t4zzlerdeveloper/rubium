import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { account } from '../../lib/appwrite';

function VerifyPage(){

    const [searchParams, setSearchParams] = useSearchParams();

    const [text,setText] = useState("Verifying...");

    useEffect(()=>{
        const userId = searchParams.get("userId")
        const secret = searchParams.get("secret")

        account.updateVerification(userId,secret)
        .then((res)=>{
            setText("Account sucessfully verified! You are now free to use Rubium.")
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
