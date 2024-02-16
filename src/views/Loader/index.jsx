import './Loader.css'
import rubiumLogo from'../../assets/rubium-logomark.svg'

function Loader(){

    return (<>
        <div className='loader fadein'>
            <img src={rubiumLogo}/>
        </div>
    </>)
}

export default Loader