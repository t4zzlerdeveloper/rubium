import './Loader.css'
import rubiumLogo from'../../assets/rubium-logomark.svg'

function Loader(props){

    return (<>
        <div className='loader fadein' style={{transform:`scale(${props.scale ? props.scale : 1})`}}>
            <img src={rubiumLogo}/>
        </div>
    </>)
}

export default Loader