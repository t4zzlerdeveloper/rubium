import { LRLanguage, LanguageSupport } from '@codemirror/language';

declare const clojureLanguage: LRLanguage;
declare function clojure(): LanguageSupport;

export { clojure, clojureLanguage };
