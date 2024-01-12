import './LoginPage.css'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import loginBack from '../../assets/login-back.jpg'
import { useEffect, useState } from 'react'

import { useUser } from "../../lib/context/user";
import Loader from '../../views/Loader';
import { useNavigate } from 'react-router-dom';

function LoginPage(){

   const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const[loading,setLoading] = useState(false);

    const user = useUser();

    useEffect(()=>{
      if(user.current) navigate("/app")
    },[user])
  
    async function login(email, password) {
      setLoading(true)
      await user.login(email, password);
      setLoading(false)
    }


    return (<div className='login-page'>

    {/* <p style={{position:"absolute",top:0,gap:"20px",zIndex:999,filter:"grayscale()"}}>
        {user.current ? `Logged in as ${user.current.name}` : 'Not logged in'}
        <button
            type="button"
            onClick={async () => {
              await user.logout();
            }}
          >
            Logout
          </button>
    </p> */}
    
    <div className='login-card'>
        <div className='login-logo-con'>
            <img src={rubiumLogo}/>
        </div>
        <h1>Sign in to Rubium</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <br/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <br></br>
        <div className='login-buttons'>
            {loading ? <Loader/> : <button  onClick={() => login(email, password)}>Sign in</button>}
        </div>
    </div>
    <div className="login-back" style={{background: `url(${loginBack})`}}></div>

    </div>)
}

export default LoginPage