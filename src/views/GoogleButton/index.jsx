import { useUser } from '../../lib/context/user';
import './GoogleButton.css'


function GoogleButton(){

    const user = useUser();

return(
    <button type="button" className="google-btn" onClick={()=>{user.loginWithGoogle()}} >
    Sign in with Google
    </button>)
}

export default GoogleButton
