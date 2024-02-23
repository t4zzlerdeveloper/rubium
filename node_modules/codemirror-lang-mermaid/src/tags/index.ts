import { Tag, tags as t } from '@lezer/highlight';

export const mermaidTags = {
  diagramName: Tag.define(t.typeName),
};

export const mindmapTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  lineText1: Tag.define(),
  lineText2: Tag.define(),
  lineText3: Tag.define(),
  lineText4: Tag.define(),
  lineText5: Tag.define(),
};

export const pieTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  lineComment: Tag.define(t.lineComment),
  number: Tag.define(t.number),
  showData: Tag.define(t.keyword),
  string: Tag.define(t.string),
  title: Tag.define(t.keyword),
  titleText: Tag.define(t.string),
};

export const flowchartTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  keyword: Tag.define(t.keyword),
  lineComment: Tag.define(t.lineComment),
  link: Tag.define(t.contentSeparator),
  nodeEdge: Tag.define(t.contentSeparator),
  nodeEdgeText: Tag.define(t.string),
  nodeId: Tag.define(t.variableName),
  nodeText: Tag.define(t.string),
  number: Tag.define(t.number),
  orientation: Tag.define(t.modifier),
  string: Tag.define(t.string),
};

export const sequenceTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  arrow: Tag.define(t.contentSeparator),
  keyword1: Tag.define(t.keyword),
  keyword2: Tag.define(t.controlKeyword),
  lineComment: Tag.define(t.lineComment),
  messageText1: Tag.define(t.string),
  messageText2: Tag.define(t.content),
  nodeText: Tag.define(t.variableName),
  position: Tag.define(t.modifier),
};

export const journeyTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  actor: Tag.define(t.variableName),
  keyword: Tag.define(t.keyword),
  lineComment: Tag.define(t.lineComment),
  score: Tag.define(t.number),
  text: Tag.define(t.string),
};

export const requirementTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  arrow: Tag.define(t.contentSeparator),
  keyword: Tag.define(t.keyword),
  lineComment: Tag.define(t.lineComment),
  number: Tag.define(t.number),
  quotedString: Tag.define(t.string),
  unquotedString: Tag.define(t.content),
};

export const ganttTags = {
  diagramName: Tag.define(mermaidTags.diagramName),
  keyword: Tag.define(t.keyword),
  lineComment: Tag.define(t.lineComment),
  string: Tag.define(t.string),
};
