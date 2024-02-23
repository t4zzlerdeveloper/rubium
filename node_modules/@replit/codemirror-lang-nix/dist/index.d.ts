import * as _lezer_common from '@lezer/common';
import { LRLanguage, LanguageSupport } from '@codemirror/language';

declare const parser: _lezer_common.Parser;
declare const nixLanguage: LRLanguage;
declare function nix(): LanguageSupport;

export { nix, nixLanguage, parser };
