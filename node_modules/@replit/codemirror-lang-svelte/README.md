# CodeMirror Svelte Mode

This is a CodeMirror 6 extension that adds support for Svelte.

### Usage

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { svelte } from "@replit/codemirror-lang-svelte";
import { basicSetup } from 'codemirror';

new EditorView({
  state: EditorState.create({
    doc: `<script>let a = "hello world";</script> <div>{a}</div>`,
    extensions: [basicSetup, svelte()],
  }),
  parent: document.querySelector('#editor'),
});
```