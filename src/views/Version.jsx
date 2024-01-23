import axios from 'axios';
import packageJson from '../../package.json';
import { useEffect, useState } from 'react';

const invalid = {color:"white",background:"red"};
const pending= {color:"black",background:"gold"};
const valid = {color:"black",background:"lime"}

function Version(){

    const[status,setStatus] = useState(0);

    useEffect(()=>{
        axios.get("https://api.github.com/repos/t4zzlerdeveloper/rubium/commits?per_page=1")
        .then((res)=>{
            console.log(res.data[0].sha)

            if(res.data[0].sha == packageJson.hash){setStatus(1)}
            else{setStatus(2)}
        })
        .catch(()=>{})
    },[])
    
    return(<div className="package-version">
        <b style={status == 1 ? valid : status == 0 ? pending : invalid}>git</b> {packageJson.hash.substring(0,7)} <section>&nbsp;</section>
    </div>)
}

export default Version