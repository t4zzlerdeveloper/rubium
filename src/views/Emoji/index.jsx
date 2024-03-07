import './emojis.css'

function Emoji(props){

    function getTextEmoji(name){
        var i = document.createElement('i');
        i.className = 'em_' + name;
        i.style.display = "none";
        document.body.appendChild(i);
        var style = window.getComputedStyle(i, '::after');
        var afterContent = style.getPropertyValue('content');
        document.body.removeChild(i);
        if (afterContent == "none") return "";
        return afterContent.replace(/['"]+/g, '');
    }


    if(props.textOnly) return getTextEmoji(props.name);

    return (<i style={{fontSize:props.size ? props.size : "16px"}} className={"em_" + props.name} onClick={(e)=>{props.onClick(e)}}/>)

}

export default Emoji