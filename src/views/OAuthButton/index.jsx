import { useUser } from '../../lib/context/user';
import './OAuthButton.css'

import githubLogo from '../../assets/github.svg'
import googleLogo from '../../assets/google.svg'

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

function GitHubButton(props){

    const user = useUser();

    const provider = providerDict[props.provider];

    return(
        <button type="button" className="oauth-btn" onClick={()=>{user.loginWith(props.provider)}} >
        <div>
            <img src={provider.img}/>
            <p>Sign in with {provider.name}</p>
        </div>

        </button>)
}

export default GitHubButton
