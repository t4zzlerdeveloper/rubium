import ptLang from '../../langs/pt.json'

class LangTranslator{

    constructor(sec){
        const ll = localStorage.getItem("locale");
        if(ll){
          this.locale = ll;
        }
        else{
           localStorage.setItem("locale","default");
           this.locale = "default";
        }
        this.sec = sec;
    }

    tr(text) {
        if(this.locale == "default") return text;
        else if(this.locale == "pt") return ptLang[this.sec][text];
    }
}

export default LangTranslator