import { useNavigate } from 'react-router'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import hero from '../../assets/hero.png'
import star from '../../assets/star.svg'
import arrow from '../../assets/arrow-down.svg'
import shield from '../../assets/encrypted.svg'
import money from '../../assets/paid.svg'
import screenshotApp from '../../assets/screenshots/login-page.png'
import screenshotNote from '../../assets/screenshots/note-page.png'
import './LandingPage.css'

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
            <button className='star-git' onClick={()=>{window.open("https://github.com/t4zzlerdeveloper/rubium")}}>
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
        <img src={screenshotApp}/>
     </div>

     <div className='screenshot-app invert-src'>
     <img src={screenshotNote}/>
        <div className='scr-app-div'>
            <img src={money} />
            <h2><strong>Free of charge</strong><br></br> Notes already cost your time.</h2>
        </div>
     </div>

    <div>
        <h4>Subscribe to our newsletter</h4>
        <input placeholder='Your email'></input>
    </div>

    <footer>
        <div className='socials'>
            <img src={rubiumLogo}/>
            <img src={rubiumLogo}/>
            <img src={rubiumLogo}/>
        </div>
        <p className='copyright'>
            &copy; 2024 Rubium. All rights reserved.
        </p>
    </footer>


    </div>)
}

export default LandingPage