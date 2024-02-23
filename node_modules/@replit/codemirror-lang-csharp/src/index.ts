import { parser as csharpParser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  continuedIndent,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

export const parser = csharpParser;

export const csharpLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Delim: continuedIndent({ except: /^\s*(?:case\b|default:)/ }),
      }),
      foldNodeProp.add({
        Delim: foldInside,
      }),
      styleTags({
        "Keyword ContextualKeyword SimpleType": t.keyword,
        "NullLiteral BooleanLiteral": t.bool,
        IntegerLiteral: t.integer,
        RealLiteral: t.float,
        'StringLiteral CharacterLiteral InterpolatedRegularString InterpolatedVerbatimString $" @$" $@"':
          t.string,
        "LineComment BlockComment": t.comment,

        ". .. : Astrisk Slash % + - ++ -- Not ~ << & | ^ && || < > <= >= == NotEq = += -= *= SlashEq %= &= |= ^= ? ?? ??= =>":
          t.operator,

        PP_Directive: t.keyword,

        TypeIdentifier: t.typeName,
        "ArgumentName AttrsNamedArg": t.variableName,
        ConstName: t.constant(t.variableName),

        //Ident: t.name,
        MethodName: t.function(t.variableName),
        ParamName: [t.emphasis, t.variableName],
        VarName: t.variableName,
        "FieldName PropertyName": t.propertyName,

        "( )": t.paren,
        "{ }": t.brace,
        "[ ]": t.squareBracket,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", '"', "'"] },
    indentOnInput:
      /^\s*((\)|\]|\})$|(else|else\s+if|catch|finally|case)\b|default:)/,
  },
});

export function csharp() {
  return new LanguageSupport(csharpLanguage);
}
