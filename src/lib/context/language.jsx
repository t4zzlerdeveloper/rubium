import ptLang from '../../langs/pt.json'

import { locale } from '../appwrite';

const languages = {
    "pt": ptLang,
    "br": ptLang //tmp
}

class LangTranslator{

    constructor(sec){

        //this.loading = true;

        locale.get()
        .then((res)=>{
            this.locale = res.countryCode.toLowerCase();
          //  this.loading = false;
        }).catch((err)=>{
            this.locale = "default";
            //this.loading = false;
        });
        this.sec = sec;
    }

    eval(text){
        if(this.locale in languages) return languages[this.locale][this.sec][text] ? true : false;
        return false;
    }

    tr(text) {
        if(this.locale in languages) return languages[this.locale][this.sec][text] ? languages[this.locale][this.sec][text] : text;
        return text;
    }
}

export default LangTranslator