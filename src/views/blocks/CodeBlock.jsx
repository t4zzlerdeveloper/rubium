import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { loadLanguage,langs } from '@uiw/codemirror-extensions-langs'
import { tags as t } from '@lezer/highlight';
import React from 'react';

const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: 'rgb(7,9,7)',
    backgroundImage: '',
    foreground: '#ffcaca',
    caret: '#F45B69',
    selection: '#832c337c',
    selectionMatch: '#d6032625',
    lineHighlight: '#998a8b1a',
    gutterBackground: 'rgb(10,12,10)',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#F45B69' },
    { tag: [t.string, t.special(t.brace)], color: '#8e1a2b' },
    { tag: t.number, color: '#665c5d' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#ccadad' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});



loadLanguage("javascript");
loadLanguage("typescript");
loadLanguage("html");
loadLanguage("css");
loadLanguage("markdown");
loadLanguage("java");
loadLanguage("python");
loadLanguage("swift");
loadLanguage("csharp");
loadLanguage("cpp");
loadLanguage("c");
loadLanguage("go");
loadLanguage("php");
loadLanguage("sql");


function getLangByName(name){

    switch(name.toLowerCase()){
        case "javascript":
            return langs.javascript();
        case "typescript":
            return langs.typescript(); 
        case "html":
            return langs.html();    
        case "css":
            return langs.css();    
        case "markdown":
            return langs.markdown();   
        case "java":
            return langs.java();  
        case "go":
            return langs.go();    
        case "python":
            return langs.python();  
        case "swift":
            return langs.swift();  
        case "c#":
            return langs.csharp(); 
        case "c++":
            return langs.cpp();   
        case "c":
            return langs.c();  
        case "php":
            return langs.php();  
        case "sql":
            return langs.sql();  
    }
   
}


export default function CodeBlock(props) {
  return (
    <CodeMirror
      value={props.value}
      height={props.collapsed ? "140px" : '100%'}
      minHeight='140px'
      width="100%"
      editable={props.editable}
      theme={myTheme}
      extensions={getLangByName(props.language)}
      onChange={(e)=>{props.onChange({target: {value: e}})}}
    />
  );
}