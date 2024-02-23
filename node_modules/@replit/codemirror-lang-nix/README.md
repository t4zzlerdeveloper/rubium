# CodeMirror Nix Mode

[![Run on Repl.it](https://replit.com/badge/github/replit/codemirror-lang-nix)](https://replit.com/@util/codemirror-lang-nix)
<span class="badge-npmversion"><a href="https://npmjs.org/package/@replit/codemirror-lang-nix" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@replit/codemirror-lang-nix.svg" alt="NPM version" /></a></span>

A codemirror extension that adds Nix syntax highlighting and language features.

![example of Nix syntax highlighting](public/nix.png)

### Usage

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { nix } from "@replit/codemirror-lang-nix";
import { basicSetup } from 'codemirror';

new EditorView({
  state: EditorState.create({
    doc: `{ pkgs ? import <nixpkgs> {} }: pkgs.mkShell { buildInputs = [ pkgs.nodejs ]; }`,
    extensions: [basicSetup, nix()],
  }),
  parent: document.querySelector('#editor'),
});
```
