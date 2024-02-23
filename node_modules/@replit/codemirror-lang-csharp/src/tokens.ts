import { ExternalTokenizer, ContextTracker } from "@lezer/lr";
import {
	interpStringContent,
	interpStringBrace,
	interpStringEnd,
	interpVStringContent,
	interpVStringBrace,
	interpVStringEnd,
} from "./syntax.grammar.terms";

const
	quote = 34,
	backslash = 92,
	braceL = 123,
	braceR = 125;

export const interpString = new ExternalTokenizer((input) => {
	for(let i = 0; ; i++) {
  		switch(input.next) {
			case -1:
				if(i > 0) input.acceptToken(interpStringContent);
				return;

			case quote:
				if(i > 0) input.acceptToken(interpStringContent);
				else input.acceptToken(interpStringEnd, 1);
				return;

			case braceL:
				if(input.peek(1) === braceL) input.acceptToken(interpStringContent, 2)
				else input.acceptToken(interpStringBrace);
				return;

			case braceR:
				if(input.peek(1) === braceR) input.acceptToken(interpStringContent, 2)
				return;

			case backslash:
				const next = input.peek(1);
				if(next === braceL || next === braceR) return;
				input.advance();
				// FALLTHROUGH

			default:
				input.advance();
		}
	}
});

export const interpVString = new ExternalTokenizer((input) => {
	for(let i = 0; ; i++) {
  		switch(input.next) {
			case -1:
				if(i > 0) input.acceptToken(interpVStringContent);
				return;

			case quote:
				if(input.peek(1) === quote) input.acceptToken(interpVStringContent, 2)
				else if(i > 0) input.acceptToken(interpVStringContent)
				else input.acceptToken(interpVStringEnd, 1);
				return;

			case braceL:
				if(input.peek(1) === braceL) input.acceptToken(interpVStringContent, 2)
				else input.acceptToken(interpVStringBrace);
				return;

			case braceR:
				if(input.peek(1) === braceR) input.acceptToken(interpVStringContent, 2)
				return;

			default:
				input.advance();
		}
	}
});