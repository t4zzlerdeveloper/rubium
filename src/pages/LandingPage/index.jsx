import { useNavigate } from 'react-router'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import hero from '../../assets/hero.png'
import star from '../../assets/star.svg'
import arrow from '../../assets/arrow-down.svg'
import shield from '../../assets/encrypted.svg'
import money from '../../assets/paid.svg'

import github from '../../assets/socials/github.svg'
import appwrite from '../../assets/socials/appwrite.svg'
import linkedin from '../../assets/socials/linkedin.svg'

import screenshotApp from '../../assets/screenshots/login-page.png'
import screenshotNote from '../../assets/screenshots/note-page.png'
import './LandingPage.css'

const DEV_GITHUB = "https://github.com/t4zzlerdeveloper";
const RUBIUM_GITHUB = DEV_GITHUB + "/rubium";

function LandingPage(){

    const navigate = useNavigate();
    return (<div className='landing-page' >
        <div style={{animation:"hero-back-anim 2s",backgroundPositionY:"-30vw",zIndex:"-1",position:"absolute",top:"0",backgroundImage:`url(${hero})`,width:"100vw",height:"130vw",backgroundRepeat:"no-repeat",backgroundSize:"contain"}}></div>
    
    <nav className='navbar'>
        <div className='nav-left'>
            <img className='nav-logo' src={rubiumLogo} onClick={()=>{document.location.reload()}}/>
            <a>Our Story</a>
            <a>Pricing</a>
            <a>Suggestions</a>
        </div>
        <div className='nav-right'>
            <button className='star-git' onClick={()=>{window.open(RUBIUM_GITHUB)}}>
                <img src={star}/>
                <p>Star on GitHub</p>
            </button>
            <button className='launch-app' onClick={()=>{navigate("/app")}}>Launch App</button>
        </div>
    </nav>

    <div className='hero'>
      <h1><strong>Notes</strong> Should Only <strong>Cost Time</strong>.</h1>
      <h4>Secure, Fast and Open-Source Note-taking app</h4>
      <p></p>
      <p></p>
      {/* <button  onClick={()=>{navigate("/app")}}>Start Rubiuming</button> */}

      <img className="arrow-down" src={arrow}/>

    
    </div>

    <div className='screenshot-app'>
        <div className='scr-app-div'>
            <img src={shield} />
            <h2><strong>Secure Authentication</strong> powered by Appwrite</h2>
        </div>
        <img src={screenshotApp} onClick={()=>{navigate("/login")}}/>
     </div>

     <div className='screenshot-app invert-src'>
     <img src={screenshotNote} onClick={()=>{navigate("/app")}}/>
        <div className='scr-app-div'>
            <img src={money} />
            <h2><strong>Free of charge</strong><br></br> Notes already cost your time.</h2>
        </div>
     </div>

    

    <footer>
        <div className='newsletter'>
            <h4>Subscribe to our newsletter</h4>
            <p>Get updates on your email about new and cool features.</p>
            <input placeholder='Your email'></input>
            <button enabled="false">Subscribe</button>
        </div>
        <div className='socials'>
            <img src={github} onClick={()=>{window.open(RUBIUM_GITHUB)}}/>
            <img src={appwrite}/>
            <img src={linkedin}/>
        </div>
        <p className='copyright'>
            &copy; {new Date().getFullYear() || "2024"} Rubium&nbsp;&nbsp;|&nbsp;&nbsp;Developed by <a onClick={()=>{window.open(DEV_GITHUB)}}> @t4zzlerdeveloper</a>
        </p>
    </footer>


    </div>)
}

export default LandingPage