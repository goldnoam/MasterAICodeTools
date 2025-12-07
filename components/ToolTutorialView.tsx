import React, { useState, useEffect, useRef } from 'react';
import { ToolTutorial, TranslationStrings } from '../types';
import { BookOpen, ChevronRight, Info, Copy, Check, Share2, ArrowRight, Clipboard, ChevronDown, ChevronUp, Maximize2, Minimize2, Link } from 'lucide-react';
import { GLOSSARY } from '../data/content';

export interface RelatedTool {
  id: string;
  name: string;
  description: string;
}

interface Props {
  tutorial: ToolTutorial;
  ui: TranslationStrings;
  relatedTools: RelatedTool[];
  isLoading?: boolean;
}

// Helper to escape regex characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// --- Syntax Highlighting Helpers ---

const KEYWORDS = [
  // JS/TS
  "const", "let", "var", "function", "return", "import", "from", "class", "export", 
  "async", "await", "if", "else", "try", "catch", "new", "interface", "type", 
  "extends", "implements", "true", "false", "null", "undefined", "void", "public", "private",
  // Python
  "def", "elif", "print", "None", "True", "False", "with", "as", "lambda", "global", "nonlocal", "pass", "break", "continue"
];

// Regex updated to handle // (JS) and # (Python/Bash) comments
const SYNTAX_REGEX = /((?:\/\/.*$|#.*$)|(?:"(?:[^"\\]|\\.)*")|(?:'(?:[^'\\]|\\.)*')|(?:`(?:[^`\\]|\\.)*`)|\b\d+\b|\b(?:const|let|var|function|return|import|from|class|export|async|await|if|else|try|catch|new|interface|type|extends|implements|true|false|null|undefined|void|public|private|def|elif|print|None|True|False|with|as|lambda|global|nonlocal|pass|break|continue)\b)/gm;

const SyntaxHighlight: React.FC<{ text: string }> = ({ text }) => {
  // Split by regex capturing groups to keep separators
  const parts = text.split(SYNTAX_REGEX);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        // Comment (JS or Python/Bash)
        if (part.startsWith('//') || part.trim().startsWith('#')) {
          return <span key={i} className="text-green-600 dark:text-green-400 italic">{part}</span>;
        }
        // String
        if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
          return <span key={i} className="text-amber-600 dark:text-amber-300">{part}</span>;
        }
        // Number
        if (/^\d+$/.test(part)) {
           return <span key={i} className="text-emerald-600 dark:text-emerald-300">{part}</span>;
        }
        // Keyword
        if (KEYWORDS.includes(part)) {
          return <span key={i} className="text-purple-600 dark:text-pink-400 font-semibold">{part}</span>;
        }

        // Default Text
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// --- Tooltips ---

// Sub-component for individual terms to handle smart positioning
const TooltipTerm: React.FC<{ term: string; definition: string }> = ({ term, definition }) => {
  const [coords, setCoords] = useState({ x: 'center', y: 'top' });
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const tooltipWidth = 256; // w-64 is approx 256px
    const windowWidth = window.innerWidth;
    
    let x = 'center';
    let y = 'top';

    // Horizontal logic
    if (rect.left < (tooltipWidth / 2)) {
      x = 'left';
    } else if (windowWidth - rect.right < (tooltipWidth / 2)) {
      x = 'right';
    }

    // Vertical logic (flip if close to top)
    if (rect.top < 180) { // arbitrary threshold for tooltip height + header
      y = 'bottom';
    }

    setCoords({ x, y });
  };

  // Dynamic classes based on position calculation
  const getPositionClasses = () => {
    let classes = "absolute z-[100] w-64 p-0 transition-all duration-200 ease-out transform origin-bottom ";
    
    // Vertical
    if (coords.y === 'top') {
      classes += "bottom-full mb-2 "; // Above
    } else {
      classes += "top-full mt-2 "; // Below
    }

    // Horizontal
    if (coords.x === 'left') {
      classes += "left-0 ";
    } else if (coords.x === 'right') {
      classes += "right-0 ";
    } else {
      classes += "left-1/2 -translate-x-1/2 ";
    }

    return classes;
  };

  const getArrowClasses = () => {
    let classes = "absolute w-3 h-3 bg-slate-900/95 border-purple-500/30 transform rotate-45 ";
    
    // Vertical placement of arrow relative to tooltip
    if (coords.y === 'top') {
      classes += "top-full -mt-1.5 border-r border-b ";
    } else {
      classes += "bottom-full -mb-1.5 border-l border-t ";
    }

    // Horizontal placement of arrow relative to tooltip
    if (coords.x === 'left') {
      classes += "left-4 ";
    } else if (coords.x === 'right') {
      classes += "right-4 ";
    } else {
      classes += "left-1/2 -translate-x-1/2 ";
    }

    return classes;
  };

  return (
    <span 
      ref={spanRef} 
      className="relative group inline-block"
      onMouseEnter={handleMouseEnter}
    >
      <span className="cursor-help text-blue-600 dark:text-blue-300 font-bold border-b border-dotted border-blue-500/50 hover:text-blue-800 dark:hover:text-white hover:border-blue-400 transition-colors">
        {term}
      </span>
      
      {/* Enhanced Tooltip */}
      <div className={`${getPositionClasses()} opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100`}>
        <div className="relative bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-blue-500/30 overflow-hidden text-left">
          <div className="bg-blue-900/20 px-4 py-2 border-b border-white/5">
              <span className="font-bold text-blue-300 text-sm block">{term}</span>
          </div>
          <div className="p-4 text-xs text-gray-200 leading-relaxed whitespace-normal">
            {definition}
          </div>
        </div>
        
        {/* Dynamic Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full flex justify-center">
            <div className={getArrowClasses()}></div>
        </div>
      </div>
    </span>
  );
};

// Component to parse code and inject tooltips with enhanced styling
const CodeWithTooltips: React.FC<{ code: string }> = ({ code }) => {
  // Sort keys by length (descending) to match "Type.ARRAY" before "Type" if we had both
  const sortedKeys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sortedKeys.map(escapeRegExp).join('|')})`, 'g');
  
  const parts = code.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const definition = GLOSSARY[part];
        if (definition) {
          return <TooltipTerm key={i} term={part} definition={definition} />;
        }
        return <SyntaxHighlight key={i} text={part} />;
      })}
    </>
  );
};

// --- Buttons ---

const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
        ${copied 
          ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
          : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-black dark:hover:text-white'
        }
      `}
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const CopySectionButton: React.FC<{ title: string, content: string, code?: string }> = ({ title, content, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `${title}\n\n${content}${code ? `\n\nCode:\n${code}` : ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border z-10
        ${copied 
          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
        }
      `}
      title="Copy section content"
    >
      {copied ? <Check size={14} /> : <Clipboard size={14} />}
      {copied ? 'Copied' : 'Copy Section'}
    </button>
  );
};

const ShareButton: React.FC = () => {
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${shared
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }
      `}
    >
      {shared ? <Check size={16} /> : <Share2 size={16} />}
      {shared ? 'Link Copied' : 'Share'}
    </button>
  );
};

const CopyToolLinkButton: React.FC<{ toolId: string }> = ({ toolId }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent triggering link
        const url = `${window.location.origin}${window.location.pathname}#${toolId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`
                p-1.5 rounded-lg transition-all duration-200
                ${copied 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                }
            `}
            title={copied ? "Copied!" : "Copy tool link"}
        >
            {copied ? <Check size={14} /> : <Link size={14} />}
        </button>
    );
};

// --- Skeleton Component ---

const TutorialSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-8">
        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        <div className="flex justify-between items-center">
          <div className="w-2/3 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="space-y-2 max-w-2xl pt-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      {/* TOC Skeleton */}
      <div className="flex gap-4">
        <div className="flex-1 h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="w-48 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
};


// --- Main View ---

export const ToolTutorialView: React.FC<Props> = ({ tutorial, ui, relatedTools, isLoading = false }) => {
  
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Reset scroll and expanded sections when tutorial changes
  useEffect(() => {
    if (tutorial) {
       setExpandedSections(new Set(tutorial.sections.map((_, i) => i)));
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [tutorial]);

  const toggleSection = (idx: number) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedSections(newSet);
  };

  const expandAll = () => {
    setExpandedSections(new Set(tutorial.sections.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  // Navigation Shortcuts
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (isLoading) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        const sections = tutorial.sections.map((_, idx) => document.getElementById(`section-${idx}`));
        const currentScroll = window.scrollY + 100;
        
        let foundIdx = -1;
        for(let i = 0; i < sections.length; i++) {
            if(sections[i] && sections[i]!.offsetTop > currentScroll) {
                foundIdx = i;
                break;
            }
        }
        
        if (foundIdx !== -1) {
            sections[foundIdx]?.scrollIntoView({ behavior: 'smooth' });
            setExpandedSections(prev => new Set(prev).add(foundIdx));
        }
      } 
      
      if (e.key === 'ArrowLeft') {
         const sections = tutorial.sections.map((_, idx) => document.getElementById(`section-${idx}`));
         const currentScroll = window.scrollY - 100;

         let foundIdx = -1;
         for(let i = sections.length - 1; i >= 0; i--) {
            if(sections[i] && sections[i]!.offsetTop < currentScroll) {
                foundIdx = i;
                break;
            }
         }

         if (foundIdx !== -1) {
             sections[foundIdx]?.scrollIntoView({ behavior: 'smooth' });
             setExpandedSections(prev => new Set(prev).add(foundIdx));
         } else if (window.scrollY > 0) {
             window.scrollTo({ top: 0, behavior: 'smooth' });
         }
      }
    };

    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [tutorial, isLoading]);


  if (isLoading) {
    return <TutorialSkeleton />;
  }

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      {/* Header Section */}
      <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
          <BookOpen size={16} />
          Tutorial
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {tutorial.name}
          </h1>
          <ShareButton />
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          {tutorial.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
          <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 font-mono">←</span>
          <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 font-mono">→</span>
          <span>to navigate sections</span>
        </div>
      </div>

      {/* Table of Contents & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {ui.toc}
          </h3>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {tutorial.sections.map((section, idx) => (
              <a 
                key={idx} 
                href={`#section-${idx}`}
                onClick={(e) => {
                  e.preventDefault();
                  // Expand the section if it's not already expanded
                  setExpandedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.add(idx);
                    return newSet;
                  });
                  // Scroll to the section with a slight delay to allow expansion rendering
                  setTimeout(() => {
                    document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <ChevronRight size={12} />
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Maximize2 size={14} />
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Minimize2 size={14} />
            Collapse All
          </button>
        </div>
      </div>

      {/* Sections Accordion */}
      <div className="space-y-6">
        {tutorial.sections.map((section, idx) => {
           const isExpanded = expandedSections.has(idx);

           return (
            <section 
              key={idx} 
              id={`section-${idx}`} 
              className={`
                group scroll-mt-24 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md
                ${isExpanded ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50/50 dark:bg-gray-800/20'}
              `}
            >
              {/* Header */}
              <div 
                onClick={() => toggleSection(idx)}
                className="flex items-center justify-between p-6 cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-colors
                    ${isExpanded 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-500 group-hover:text-white'
                    }
                  `}>
                    {idx + 1}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                  {isExpanded && (
                    <CopySectionButton 
                      title={section.title} 
                      content={section.content} 
                      code={section.code} 
                    />
                  )}
                  <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div 
                className={`
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-6 pb-8 pt-0">
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line mb-6 pl-[3.25rem]">
                    <p>{section.content}</p>
                  </div>

                  {section.code && (
                    <div className="relative group/code rounded-xl shadow-2xl bg-[#1e1e1e] border border-gray-700 ml-0 md:ml-[3.25rem] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                             <Info size={14} className="text-slate-400" />
                             <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                              {section.codeLanguage || 'text'} • Hover terms
                            </span>
                          </div>
                          <div className="h-4 w-px bg-gray-600" />
                          <CopyButton code={section.code} />
                        </div>
                      </div>
                      
                      <div className="flex overflow-x-auto">
                        {/* Line Numbers */}
                        <div className="py-4 px-3 text-right bg-[#1e1e1e] border-r border-gray-800 select-none">
                            {section.code.split('\n').map((_, i) => (
                                <div key={i} className="text-xs text-slate-500 font-mono leading-relaxed">{i + 1}</div>
                            ))}
                        </div>
                        
                        {/* Code Content */}
                        <div className="p-4 w-full">
                          <pre className="font-mono text-sm leading-relaxed text-blue-100">
                            <code>
                              <CodeWithTooltips code={section.code} />
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {relatedTools.length > 0 && (
        <div className="pt-16 mt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Keep Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id}
                className="flex flex-col p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {tool.name}
                   </div>
                   <CopyToolLinkButton toolId={tool.id} />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
                  {tool.description}
                </p>
                <a 
                  href={`#${tool.id}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Learn More <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};