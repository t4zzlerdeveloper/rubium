import {styleTags, tags as t} from "@lezer/highlight"

export const lezerHighlighting = styleTags({
  LineComment: t.lineComment,
  BlockComment: t.blockComment,
  AnyChar: t.character,
  Literal: t.string,
  "tokens from grammar as empty prop extend specialize AtName": t.keyword,
  "@top @left @right @cut @external": t.modifier,
  "@precedence @tokens @context @dialects @skip @detectDelim @conflict": t.definitionKeyword,
  "@extend @specialize": t.operatorKeyword,
  "CharSet InvertedCharSet": t.regexp,
  "CharClass": t.atom,
  RuleName: t.variableName,
  "RuleDeclaration/RuleName InlineRule/RuleName TokensBody/RuleName": t.definition(t.variableName),
  PrecedenceName: t.labelName,
  Name: t.name,
  "( )": t.paren,
  "[ ]": t.squareBracket,
  "{ }": t.brace,
  '"!" ~ "*" + ? |': t.operator
})
