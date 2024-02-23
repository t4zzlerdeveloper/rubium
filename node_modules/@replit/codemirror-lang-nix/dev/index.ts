import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { nix, parser } from "../dist/";
import { printTree } from "./print-lezer-tree";
import { oneDark } from '@codemirror/theme-one-dark';

const doc = `
{ a, b, ... }:
/***
 * This is a block comment
 *
 */
with import <nixpkgs> { };
let
  list = [["a"] ["b"] ["c"]];
  some_path = ./this/is/a/path;

  attrList = [{a = 1;} {b = 0;} {a = 2;}];
  catAttrs = TODO;
  this_is_null = null;
  idk = if false then "a" else "b";
  this_is_true = true;
in
rec {
  buildInputs = [
    pkgs.rustc
    pkgs.cargo
  ];
  inherit nixpkgs;
  inherit (nixpkgs) lib;
  example = builtins.concatLists list; #is [ "a" "b" "c" ]
  result = catAttrs "a" attrList; #should be [1 2] 
  a_float = 1.23;
  interpolation = "this is \${a_float} float";
  multiline_string = ''
    This is a multiline string. \${1 + 3}
    \\\${this is not interpolated}
    'some string in single quotes' \${nixpkgs}
  '';
}

`

new EditorView({
  state: EditorState.create({
    doc,
    extensions: [basicSetup, nix(), oneDark, EditorView.lineWrapping],
  }),
  parent: document.querySelector('#editor'),
});

console.log(printTree(parser.parse(doc), doc));
