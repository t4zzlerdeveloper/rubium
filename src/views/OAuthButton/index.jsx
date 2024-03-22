import { useUser } from '../../lib/context/user';
import './OAuthButton.css'

import githubLogo from '../../assets/github.svg'
import googleLogo from '../../assets/google.svg'
import LangTranslator from '../../lib/context/language';

const providerDict =
{
    "google": {
        name:"Google",
        img: googleLogo,
    },
    "github": {
        name:"GitHub",
        img: githubLogo,
    }
}

const lang = new LangTranslator("OAuthButton");


function OAuthButton(props){


    const user = useUser();

    const provider = providerDict[props.provider];

    return(
        <button type="button" className="oauth-btn" onClick={()=>{props.onClick();user.loginWith(props.provider);}} >
        <div>
            <img src={provider.img}/>
            <p>{lang.tr("Sign in with")} {provider.name}</p>
        </div>

        </button>)
}

export default OAuthButton
