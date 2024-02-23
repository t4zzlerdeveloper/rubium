import { LanguageDescription } from '@codemirror/language';
import {
  mermaid,
  mindmap,
  pie,
  flowchart,
  sequence,
  journey,
  requirement,
  gantt,
} from '../language-support';
import { MermaidDescriptionName, MermaidAlias } from '../types';

export const mermaidLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Mermaid,
  load: async () => {
    return mermaid();
  },
});

export const mindmapLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Mindmap,
  load: async () => {
    return mindmap();
  },
});

export const pieLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Pie,
  load: async () => {
    return pie();
  },
});

export const flowchartLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Flowchart,
  alias: [MermaidAlias.Graph],
  load: async () => {
    return flowchart();
  },
});

export const sequenceLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Sequence,
  alias: [MermaidAlias.Sequence],
  load: async () => {
    return sequence();
  },
});

export const journeyLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Journey,
  load: async () => {
    return journey();
  },
});

export const requirementLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Requirement,
  alias: [MermaidAlias.Requirement],
  load: async () => {
    return requirement();
  },
});

export const ganttLanguageDescription = LanguageDescription.of({
  name: MermaidDescriptionName.Gantt,
  load: async () => {
    return gantt();
  },
});
