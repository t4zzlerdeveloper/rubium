import { ExternalTokenizer, ContextTracker } from "@lezer/lr";
import {
  strContent,
  indStrContent,
  strDollarBrace,
  indStrDollarBrace,
  strEnd,
  indStrEnd,
  escapeSequence,
  indEscapeSequence,
} from "./syntax.grammar.terms";

const quote = 34,
  backslack = 92,
  braceL = 123,
  dollar = 36,
  apostrophe = 39;

export const scanString = new ExternalTokenizer((input) => {
  for (let afterDollar = false, i = 0; ; i++) {
    let { next } = input;
    if (next < 0) {
      if (i > 0) input.acceptToken(strContent);
      break;
    } else if (next === quote) {
      if (i > 0) input.acceptToken(strContent);
      else input.acceptToken(strEnd, 1);
      break;
    } else if (next === braceL && afterDollar) {
      if (i == 1) input.acceptToken(strDollarBrace, 1);
      else input.acceptToken(strContent, -1);
      break;
    } else if (next === backslack) {
      input.advance();
      input.acceptToken(escapeSequence, 1);
    }
    afterDollar = next === dollar;
    input.advance();
  }
});

export const scanIndString = new ExternalTokenizer((input) => {
  for (let afterDollar = false, afterApostrophe = false, i = 0; ; i++) {
    let { next } = input;
    if (next < 0) {
      if (i > 0) input.acceptToken(indStrContent);
      break;
    } else if (next === apostrophe && afterApostrophe) {
      if (i > 1) input.acceptToken(indStrContent, -1);
      else input.acceptToken(indStrEnd, 1);
      break;
    } else if (next === braceL && afterDollar) {
      if (i == 1) input.acceptToken(indStrDollarBrace, 1);
      else input.acceptToken(indStrContent, -1);
      break;
    } else if (next === backslack) {
      input.advance();
      input.acceptToken(indEscapeSequence, 1);
    }
    afterDollar = next === dollar;
    afterApostrophe = next === apostrophe;
    input.advance();
  }
});
