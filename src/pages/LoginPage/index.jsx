import './LoginPage.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import loginBack from '../../assets/login-back.webp'
import { useEffect, useState } from 'react'

import { useUser } from "../../lib/context/user";
import Loader from '../../views/Loader';
import { useNavigate } from 'react-router-dom';
import Toast from '../../views/Toast';
import OAuthButton from '../../views/OAuthButton';
import LangTranslator from '../../lib/context/language';

const validStyle = {color:"rgba(255,255,255,0.8)"};
const invalidStyle = {color:"rgba(211, 111, 111,0.8)"};

const lang = new LangTranslator("LoginPage");

function LoginPage(){

   const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validEmail,setValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword,setValidPassword] = useState(false);

    const [firstType,setFirstType] = useState(true);

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
        showToast(lang.tr("Invalid credentials or account does not exist..."),"error")
        setLoading(false)
      });
     
    }


    function handleEmailChange(e){
      setFirstType(false);
      const newEmail = e.target.value;

      let emailParts = newEmail.split('@');
      emailParts[1] = newEmail.split('.');
      const valid = (emailParts[0] || "") .length >= 1 &&
                    (emailParts[1][0]|| "").length >= 1 &&
                    (emailParts[1][1] || "").length >= 1;

      setValidEmail(valid);
      setEmail(newEmail);

    }




    function handlePasswordChange(e){
      setFirstType(false);
      const newPassword = e.target.value;
      setValidPassword(newPassword.length > 7);
      setPassword(newPassword);
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
        <h1>{lang.tr("Sign in to Rubium")}</h1>
        <input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("pwd-f").focus()}}} 
          onChange={(e)=>{handleEmailChange(e)}}
          style={firstType || validEmail ? validStyle : invalidStyle}
          />
          
        
        <input 
          id="pwd-f"
          type="password" 
          placeholder="Password" 
          value={password} 
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("lg-btn").click()}}} 
          onChange={(e)=>{handlePasswordChange(e);}}
          style={firstType || validPassword ? validStyle : invalidStyle}
        />

        <br></br>
        {loading ? <Loader/> :
        <div className='login-buttons'>
             <a  onClick={() => navigate("/register")}>{lang.tr("Not yet registered?")}</a>
            <button id="lg-btn" disabled={!validEmail || !validPassword}  onClick={() => {if(validEmail && validPassword){login(email, password)}else{showToast("Invalid credentials...","error")}}}>{lang.tr("Sign in")}</button>
        </div>}   

        {loading ? <></> :<> 
        <section className='login-sep'><br/></section>
        <OAuthButton provider="google" onClick={()=>{setLoading(true)}}/>
        <OAuthButton provider="github" onClick={()=>{setLoading(true)}}/>
        <p className='login-cookie'>{lang.tr("In order to use these authentication methods, 3rd party cookies must be enabled in your browser.")}</p>

        </>}
    </div>
    <div className="login-back" style={{background: `url(${loginBack})`,backgroundSize:"cover"}}></div>

    </div>)
}

export default LoginPage