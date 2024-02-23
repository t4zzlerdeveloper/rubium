import { Parser } from "@lezer/common";
import { MarkdownExtension } from "./markdown";
export declare function parseCode(config: {
    codeParser?: (info: string) => null | Parser;
    htmlParser?: Parser;
}): MarkdownExtension;
