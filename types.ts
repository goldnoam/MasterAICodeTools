export enum Language {
  EN = 'en',
  HE = 'he',
  ZH = 'zh',
  HI = 'hi',
  ES = 'es',
  RU = 'ru',
}

export type ToolId = 'aistudio' | 'cursor' | 'claude' | 'chatgpt' | 'vscode' | 'copilot' | 'langchain';

export interface Section {
  title: string;
  content: string;
  code?: string;
  codeLanguage?: string; // e.g., 'typescript', 'python', 'bash'
}

export interface ToolTutorial {
  id: ToolId;
  name: string;
  description: string;
  sections: Section[];
}

export interface TranslationStrings {
  selectTool: string;
  language: string;
  theme: string;
  footerRights: string;
  sendFeedback: string;
  toc: string; // Table of Contents
  welcomeTitle: string;
  welcomeSubtitle: string;
  searchPlaceholder: string;
  aboutTool: string;
  popularTools: string;
}

export interface ContentData {
  [key: string]: { // Language code
    ui: TranslationStrings;
    tutorials: {
      [key in ToolId]: ToolTutorial;
    };
  };
}