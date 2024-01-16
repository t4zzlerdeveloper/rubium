import './LoginPage.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import loginBack from '../../assets/login-back.jpg'
import { useEffect, useState } from 'react'

import { useUser } from "../../lib/context/user";
import Loader from '../../views/Loader';
import { useNavigate } from 'react-router-dom';
import Toast from '../../views/Toast';

function LoginPage(){

   const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const[loading,setLoading] = useState(false);

    const user = useUser();

    useEffect(()=>{
      if(user.current) navigate("/app")
    },[user])
  
    function login(email, password) {
      setLoading(true)
      user.login(email, password)
      .then((res)=>{
        setLoading(false)
      })
      .catch(()=>{
        showToast("Invalid credentials or account does not exist...","error")
        setLoading(false)
      });
     
    }

    const [toastMessage,setToastMessage] = useState("");
    function showToast(msg,type) {
      setToastMessage(msg)
      var x = document.getElementById("toast")
      const newClassName = "show " + type;
      x.className = newClassName
      setTimeout(function(){ x.className = x.className.replace(newClassName, ""); }, 4900);
    }


    return (<div className='login-page'>
    
    <div className='login-card'>
       <Toast message={toastMessage}/>
        <div className='login-logo-con'>
            <img src={rubiumLogo}/>
        </div>
        <h1>Sign in to Rubium</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <br/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <br></br>
        {loading ? <Loader/> :
        <div className='login-buttons'>
             <a  onClick={() => navigate("/register")}>Not yet registered?</a>
            <button  onClick={() => login(email, password)}>Sign in</button>
        </div>} 
    </div>
    <div className="login-back" style={{background: `url(${loginBack})`,backgroundSize:"cover"}}></div>

    </div>)
}

export default LoginPage