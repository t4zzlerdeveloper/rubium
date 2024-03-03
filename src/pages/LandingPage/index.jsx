import { useNavigate } from 'react-router'
import rubiumLogo from '../../assets/rubium-logomark.svg'
import hero from '../../assets/hero.webp'
import star from '../../assets/star.svg'
import arrow from '../../assets/arrow-down.svg'
import shield from '../../assets/encrypted.svg'
import money from '../../assets/paid.svg'

import github from '../../assets/socials/github.svg'
import appwrite from '../../assets/socials/appwrite.svg'
import linkedin from '../../assets/socials/linkedin.svg'

import screenshotApp from '../../assets/screenshots/login-page.webp'
import screenshotNote from '../../assets/screenshots/note-page.webp'
import './LandingPage.css'
import { useEffect, useState } from 'react'
import LangTranslator from '../../lib/context/language'
import { useUser } from '../../lib/context/user'
import { locale } from '../../lib/appwrite'


const DEV_GITHUB = "https://github.com/t4zzlerdeveloper";
const RUBIUM_GITHUB = DEV_GITHUB + "/rubium";





function LandingPage(){

    const user = useUser();
    const lang = new LangTranslator("LandingPage",user);

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])

    useEffect(()=>{
        window.document.title = "Rubium - " + lang.tr("Notes") + " " +  lang.tr("Should Only") + " " + lang.tr("Cost Time")
    },[user])



    const navigate = useNavigate();

    return (
        <div className='landing-page' >
        <div style={{animation:"hero-back-anim 2s",backgroundPositionY:"-30vw",zIndex:"-1",position:"absolute",top:"0",backgroundImage:`url(${hero})`,width:"100vw",height:"130vw",backgroundRepeat:"no-repeat",backgroundSize:"contain"}}></div>
    
    <nav className='navbar'>
        <div className='nav-left'>
            <img className='nav-logo' src={rubiumLogo} onClick={()=>{document.location.reload()}}/>
            <a>{lang.tr("Our Story")}</a>
            <a>{lang.tr("Pricing")}</a>
            <a>{lang.tr("Suggestions")}</a>
        </div>
        <div className='nav-right'>
            <button className='star-git' onClick={()=>{window.open(RUBIUM_GITHUB)}}>
                <img src={star}/>
                <p>{lang.tr("Star on GitHub")}</p>
            </button>
            <button className='launch-app' onClick={()=>{navigate("/app")}}>{lang.tr("Launch App")}</button>
        </div>
    </nav>

    <div className='hero'>
      <h1><strong>{lang.tr("Notes")}</strong> {lang.tr("Should Only")} <strong>{lang.tr("Cost Time")}</strong>.</h1>
      <h4>{lang.tr("Secure, Fast and Open-Source Note-taking app")}</h4>
      <p></p>
      <p></p>

      <img className="arrow-down" src={arrow} 
      onClick={()=>{window.scrollTo({
                top: 1000,
                left: 0,
                behavior: "smooth",
    })}}/>

    
    </div>

    <div className='screenshot-app'>
        <div className='scr-app-div'>
            <img src={shield} /> 
            <h2><strong>{lang.tr("Secure Authentication")}</strong> {lang.tr("powered by Appwrite")} </h2>
        </div>
        <img src={screenshotApp} onClick={()=>{navigate("/login")}}/>
     </div>

     <div className='screenshot-app invert-src'>
     <img src={screenshotNote} onClick={()=>{navigate("/app")}}/>
        <div className='scr-app-div'>
            <img src={money} />
            <h2><strong>{lang.tr("Free of charge")}</strong><br></br> {lang.tr("Notes already cost your time.")}</h2>
        </div>
     </div>

    

    <footer>
        <div className='newsletter'>
            <h4>{lang.tr("Subscribe to our newsletter")}</h4>
            <p>{lang.tr("Get updates on your email about new and cool features.")}</p>
            <input placeholder={lang.tr('Your email')}></input>
            <button enabled="false">{lang.tr("Subscribe")}</button>
        </div>
        <div className='socials'>
            <img src={github} onClick={()=>{window.open(RUBIUM_GITHUB)}}/>
            <img src={appwrite}/>
            <img src={linkedin}/>
        </div>
        <p className='copyright'>
            &copy; {new Date().getFullYear() || "2024"} Rubium&nbsp;&nbsp;|&nbsp;&nbsp;{lang.tr("Developed by")} <a onClick={()=>{window.open(DEV_GITHUB)}}> @t4zzlerdeveloper</a>
        </p>
    </footer>


    </div>)
}

export default LandingPage