import './emojis.css'

function Emoji(props){

    return (<i style={{fontSize:props.size ? props.size : "16px"}}className={"em_" + props.name} onClick={(e)=>{props.onClick(e)}}/>)

}

export default Emoji