import './RegisterPage.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import registerBack from '../../assets/register-back.webp'
import { useEffect, useState } from 'react'

import { useUser } from "../../lib/context/user";
import Loader from '../../views/Loader';
import { useNavigate } from 'react-router-dom';
import Toast from '../../views/Toast';
import LangTranslator from '../../lib/context/language';


const validStyle = {color:"rgba(255,255,255,0.8)"};
const invalidStyle = {color:"rgba(211, 111, 111,0.8)"};

const lang = new LangTranslator("RegisterPage");

function RegisterPage(){

    const navigate = useNavigate();

    const[firstType,setFirstType] = useState(true);

    const [name, setName] = useState('');
    const [validName,setValidName] = useState(false);
    const [email, setEmail] = useState('');
    const [validEmail,setValidEmail] = useState(false);
    const [emailCopy, setEmailCopy] = useState('');
    const [validEmailCopy,setValidEmailCopy] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword,setValidPassword] = useState(false);

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
        showToast(lang.tr("Invalid details or connection error..."),"error")
        setLoading(false)
      });
     
    }


    function handleNameChange(e){
      setFirstType(false);
      const newName = e.target.value;
      setValidName(newName.length > 1)
      setName(newName);
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

    function handleEmailCopyChange(e){
      setFirstType(false);
      const newEmailCopy = e.target.value;

      let emailParts = newEmailCopy.split('@');
      emailParts[1] = newEmailCopy.split('.');
      const valid = (emailParts[0] || "") .length >= 1 &&
                    (emailParts[1][0]|| "").length >= 1 &&
                    (emailParts[1][1] || "").length >= 1;

      setValidEmailCopy(valid && validEmail && email == newEmailCopy);
      setEmailCopy(newEmailCopy);

    }

    function handlePasswordChange(e){
      setFirstType(false);
      const newPassword = e.target.value;
      setValidPassword(newPassword.length > 7)
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

    return (<div className='register-page'>
    
    <div className='register-card'>
       <Toast message={toastMessage}/>
        <div className='register-logo-con'>
            <img src={rubiumLogo}/>
        </div>
        <h1>{lang.tr("Create your Rubium's Account")}</h1>
        <input 
          type="text" 
          placeholder={lang.tr("Name") + "*"} 
          value={name}
          onChange={(e)=>{handleNameChange(e)}}
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("el-f").focus()}}} 
          style={firstType || validName ? validStyle : invalidStyle}/>
        <input 
          id='el-f'  
          type="text" 
          placeholder="Email*" 
          value={email} 
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("elc-f").focus()}}} 
          onChange={(e)=>{handleEmailChange(e)}}
          style={firstType || validEmail ? validStyle : invalidStyle}/>
        <input 
          id='elc-f'  
          type="text" 
          placeholder={lang.tr("Confirm") + " Email*"}
          value={emailCopy} 
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("pwd-f").focus()}}} 
          onChange={(e)=>{handleEmailCopyChange(e)}}
          style={firstType || validEmailCopy ? validStyle : invalidStyle}/>
        <input
          id='pwd-f'  
          type="password" 
          placeholder="Password*" 
          value={password} 
          onKeyDown={(e)=>{if(e.key == "Enter"){document.getElementById("rg-f").click()}}} 
          onChange={(e)=>{handlePasswordChange(e)}}
          style={firstType || validPassword ? validStyle : invalidStyle}/>
        <br></br>
        {loading ? <Loader/> :
        <div className='register-buttons'>
             <a  onClick={() => navigate("/login")}>{lang.tr("Already have an account?")}</a>
            <button id="rg-f" disabled={!validName || !validEmail || !validEmailCopy || !validPassword} onClick={() => {if(validName && validEmail && validEmailCopy && validPassword){register(name,email, password)}}}>{lang.tr("Sign up")}</button>
        </div>} 
    </div>
    <div className="register-back" style={{background: `url(${registerBack})`,backgroundSize:"cover"}}></div>

    </div>)
}

export default RegisterPage