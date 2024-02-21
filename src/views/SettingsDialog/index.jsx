import { useEffect, useState } from 'react';
import './SettingsDialog.css'

import { avatars,databases,functions } from '../../lib/appwrite'
import { useUser } from '../../lib/context/user';

import closeIcon from '../../assets/close.svg'
import Loader from '../Loader';
import LangTranslator from '../../lib/context/language';



function SettingsDialog(props){
  
  const user = useUser();
  const lang = new LangTranslator("SettingsDialog",user);

  const [confirmed,setConfirmed] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [locale,setLocale] = useState("en");

  
    useEffect(()=>{
        if(props.display) setConfirmed(false);
    },[props.display])

    useEffect(()=>{
      if(!user.current) return;
      setName(user.current.name)
      setEmail(user.current.email)
      setLocale(user.current.prefs.locale);
    },[user,props.display])

  
    function getYear(datetime){
      const d = new Date(datetime);
      return d.getFullYear();  
    }

    function handleLocaleChange(e){
      const newLocale = e.target.value;
      setLocale(newLocale);
    }
    

    const[saving,setSaving] = useState(false);

    function saveDetails(){
      setSaving(true);
      user.updateUserSettings(name,{...user.current.prefs,locale:locale}).then(()=>{
        lang.setLocale(locale);
        setSaving(false);
        setConfirmed(true);props.onClose()
      })
      
     
    }



    return(<>
        <div className={props.display && !confirmed ? 'settings-dialog' : 'settings-dialog-hidden' }>
            <div>
                <div className="st-top" >
                    <h4>{lang.tr("Settings")}</h4>
                    <img  onClick={()=>{props.onClose();setConfirmed(true)}} src={closeIcon}/>
                </div>

                {user && user.current ? <div className='st-dtls'>


                <div>
                  <img src={avatars.getInitials(name || " ")}/>
                  <p>{lang.tr("You are a Rubium member since")} <strong>{ getYear(user.current.$createdAt)} </strong><br/></p>
                </div>
                
                  <div>
                    <p>{lang.tr("Name")} <input value={name} onChange={(e)=>{setName(e.target.value)}}></input></p>
                    <p>Email <input disabled={true} value={email}></input></p>
                    <p>{lang.tr("Language")}
                  <select value={locale} onChange={(e)=>{handleLocaleChange(e)}}>
                  {lang.getLangs().map(l => {
                      return <option value={l.locale}>{l.name}</option>
                  })}
                  </select></p>
                  </div>

                 
                
                </div>:<Loader/>}

                
            <div className='st-right'>
              {saving ? <Loader/> : 
              <button onClick={()=>{saveDetails()}}>{lang.tr("Save Changes")}</button>}
            </div>
              
                   
            </div>
        </div>
    </>)
}

export default SettingsDialog