import { useUser } from '../../lib/context/user';
import './GitHubButton.css'

import githubLogo from '../../assets/github.svg'


function GitHubButton(){

    const user = useUser();

return(
    <button type="button" className="google-btn" onClick={()=>{user.loginWithGitHub()}} >
    <div>
        <img src={githubLogo}/>
        <p>Sign in with GitHub</p>
    </div>

    </button>)
}

export default GitHubButton
