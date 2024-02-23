import { LRLanguage } from '@codemirror/language';
import { parseMixed } from '@lezer/common';
import {
  mermaidParser,
  mindmapParser,
  pieParser,
  flowchartParser,
  sequenceParser,
  journeyParser,
  requirementParser,
  ganttParser,
} from '../parsers';
import { DiagramType, MermaidLanguageType } from '../types';

export const mermaidLanguage = LRLanguage.define({
  name: MermaidLanguageType.Mermaid,
  parser: mermaidParser.configure({
    wrap: parseMixed((node) => {
      switch (node.name) {
        case DiagramType.Mindmap:
          return { parser: mindmapParser };
        case DiagramType.Pie:
          return { parser: pieParser };
        case DiagramType.Flowchart:
          return { parser: flowchartParser };
        case DiagramType.Sequence:
          return { parser: sequenceParser };
        case DiagramType.Journey:
          return { parser: journeyParser };
        case DiagramType.Requirement:
          return { parser: requirementParser };
        case DiagramType.Gantt:
          return { parser: ganttParser };
        default:
          return null;
      }
    }),
  }),
});

export const mindmapLanguage = LRLanguage.define({
  name: MermaidLanguageType.Mindmap,
  parser: mindmapParser,
});

export const pieLanguage = LRLanguage.define({
  name: MermaidLanguageType.Pie,
  parser: pieParser,
});

export const flowchartLanguage = LRLanguage.define({
  name: MermaidLanguageType.Flowchart,
  parser: flowchartParser,
});

export const sequenceLanguage = LRLanguage.define({
  name: MermaidLanguageType.Sequence,
  parser: sequenceParser,
});

export const journeyLanguage = LRLanguage.define({
  name: MermaidLanguageType.Journey,
  parser: journeyParser,
});

export const requirementLanguage = LRLanguage.define({
  name: MermaidLanguageType.Requirement,
  parser: requirementParser,
});

export const ganttLanguage = LRLanguage.define({
  name: MermaidLanguageType.Gantt,
  parser: ganttParser,
});
