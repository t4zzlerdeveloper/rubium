# CodeMirror C# Language Support

A CodeMirror extension that provides C# syntax highlighting and language support.


### Usage

```ts
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { csharp } from "@replit/codemirror-lang-csharp";
import { basicSetup } from 'codemirror';

new EditorView({
  state: EditorState.create({
    doc: `
using System;
namespace Test
{
  class Program
  {
    public static void Main(string[] args)
    {
      Console.WriteLine("Hello, world!");
    }
  }
}
`,
    extensions: [basicSetup, csharp()],
  }),
  parent: document.querySelector('#editor'),
});
```