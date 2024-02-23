import {
  ShortExpression,
  LongExpression,
  ScriptText,
  StyleText,
  TextareaText,
  Element
} from "./syntax.grammar.terms"
import { parseMixed } from "@lezer/common"
import { parser as javascriptParser } from "@lezer/javascript"

function getAttrs(element, input) {
  let attrs = Object.create(null)
  for (let att of element.firstChild.getChildren("Attribute")) {
    let name = att.getChild("AttributeName"),
      value = att.getChild("AttributeValue") || att.getChild("UnquotedAttributeValue")
    if (name)
      attrs[input.read(name.from, name.to)] = !value
        ? ""
        : value.name == "AttributeValue"
        ? input.read(value.from + 1, value.to - 1)
        : input.read(value.from, value.to)
  }
  return attrs
}

function maybeNest(node, input, tags) {
  let attrs
  for (let tag of tags) {
    if (!tag.attrs || tag.attrs(attrs || (attrs = getAttrs(node.node.parent, input))))
      return { parser: tag.parser }
  }
  return null
}

const expressionParser = javascriptParser.configure({ top: "SingleExpression" })

// tags: {
//   tag: "script" | "style" | "textarea",
//   attrs?: ({[attr: string]: string}) => boolean,
//   parser: Parser
// }[]

export function configureNesting(tags) {
  let script = [],
    style = [],
    textarea = []
  for (let tag of tags) {
    let array =
      tag.tag == "script"
        ? script
        : tag.tag == "style"
        ? style
        : tag.tag == "textarea"
        ? textarea
        : null
    if (!array)
      throw new RangeError(
        "Only script, style, and textarea tags can host nested parsers"
      )
    array.push(tag)
  }
  return parseMixed((node, input) => {
    let id = node.type.id
    if (id === LongExpression) return { parser: expressionParser }
    if (id === ShortExpression) return { parser: expressionParser }
    if (id === ScriptText) return maybeNest(node, input, script)
    if (id === StyleText) return maybeNest(node, input, style)
    if (id === TextareaText) return maybeNest(node, input, textarea)
    return null
  })
}
