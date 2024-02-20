import ptLang from '../../langs/pt.json'
import brLang from '../../langs/br.json'
import esLang from '../../langs/es.json'
import cnLang from '../../langs/cn.json'

import { locale } from '../appwrite';

const languages = {
    "en": {name:"English"},
    "pt": {name:"Português (Portugal)", data: ptLang},
    "br": {name:"Português (Brasil)", data: brLang},
    "es": {name: "Español",data: esLang},
    "cn": {name:"中国人",data:cnLang}
}

class LangTranslator{

    constructor(sec,user = undefined){

        if(user && user.current){
            this.locale = user.current.prefs.locale;
        }
        else{
            //If not logged in, set locale by geo-ip
             locale.get()
            .then((res)=>{
                this.locale = res.countryCode.toLowerCase();
            }).catch((err)=>{
                this.locale = "en";
            });
        }
       
        this.sec = sec;
    }

    setLocale(newLocale){
        this.locale = newLocale;
    }

    getLangs(){
        let langs = [];
        for (const [key, value] of Object.entries(languages)) {
            langs.push({locale:key,name:value.name})
          }
        return langs;
    }

    getLocale() {
        return this.locale
    }

    eval(text){
        try{
            if(languages[this.locale].data) return languages[this.locale].data[this.sec][text] ? true : false;
        }
        catch{
            return false;
        }
        return false;
    }

    tr(text) {
        try{
            if(languages[this.locale].data) return languages[this.locale].data[this.sec][text] ? languages[this.locale].data[this.sec][text] : text;
        }
        catch{
            return text;
        }
        return text;
    }
}

export default LangTranslator