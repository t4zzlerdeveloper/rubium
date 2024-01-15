import './RegisterPage.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import registerBack from '../../assets/register-back.jpg'
import { useEffect, useState } from 'react'

import { useUser } from "../../lib/context/user";
import Loader from '../../views/Loader';
import { useNavigate } from 'react-router-dom';
import Toast from '../../views/Toast';


function RegisterPage(){

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const[loading,setLoading] = useState(false);

    const user = useUser();

    useEffect(()=>{
      if(user.current) navigate("/app")
    },[user])
  
    function register(name,email, password) {
      setLoading(true)
      user.register(name,email, password)
      .then((res)=>{
        setLoading(false)
      })
      .catch(()=>{
        showToast("Invalid details or connection error...","error")
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

    return (<div className='register-page'>
    
    <div className='register-card'>
       <Toast message={toastMessage}/>
        <div className='register-logo-con'>
            <img src={rubiumLogo}/>
        </div>
        <h1>Create your Rubium's Account </h1>
        <input stype="text" placeholder="Name*" value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <input type="text" placeholder="Email*" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <br/>
        <input type="password" placeholder="Password*" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <br></br>
        {loading ? <Loader/> :
        <div className='register-buttons'>
             <a  onClick={() => navigate("/login")}>Already have an account?</a>
            <button  onClick={() => register(name,email, password)}>Sign up</button>
        </div>} 
    </div>
    <div className="register-back" style={{background: `url(${registerBack})`}}></div>

    </div>)
}

export default RegisterPage