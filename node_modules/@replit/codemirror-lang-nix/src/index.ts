import { parser as nixParser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  continuedIndent,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import {
  completeFromList,
  ifNotIn,
  snippetCompletion as snip,
  Completion,
} from "@codemirror/autocomplete";

export const parser = nixParser;

export const nixLanguage = LRLanguage.define({
  name: 'Nix',
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Parenthesized: delimitedIndent({ closing: ")" }),
        AttrSet: delimitedIndent({ closing: "}" }),
        List: delimitedIndent({ closing: "]" }),
        Let: continuedIndent({ except: /^\s*in\b/ }),
      }),
      foldNodeProp.add({
        AttrSet: foldInside,
        List: foldInside,
        Let(node) {
          let first = node.getChild("let"),
            last = node.getChild("in");
          if (!first || !last) return null;
          return { from: first.to, to: last.from };
        },
      }),
      styleTags({
        Identifier: t.propertyName,
        Boolean: t.bool,
        String: t.string,
        IndentedString: t.string,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        Float: t.float,
        Integer: t.integer,
        Null: t.null,
        URI: t.url,
        SPath: t.literal,
        Path: t.literal,
        "( )": t.paren,
        "{ }": t.brace,
        "[ ]": t.squareBracket,
        "if then else": t.controlKeyword,
        "import with let in rec builtins inherit assert or": t.keyword,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "''", '"'] },
    indentOnInput: /^\s*(in|\}|\)|\])$/,
  },
});

const snippets: readonly Completion[] = [
  snip("let ${binds} in ${expression}", {
    label: "let",
    detail: "Let ... in statement",
    type: "keyword",
  }),
  snip("with ${expression}; ${expression}", {
    label: "with",
    detail: "With statement",
    type: "keyword",
  }),
];

export function nix() {
  return new LanguageSupport(
    nixLanguage,
    nixLanguage.data.of({
      autocomplete: ifNotIn(
        ["LineComment", "BlockComment", "String", "IndentedString"],
        completeFromList(snippets)
      ),
    })
  );
}
