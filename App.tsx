import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ToolTutorialView, RelatedTool } from './components/ToolTutorialView';
import { DATA, GLOSSARY } from './data/content';
import { Language, ToolId } from './types';
import { Bot, Code2, Terminal, Cpu, Sparkles, Command, Search, ArrowRight, Info, ChevronDown, ChevronUp, Book, BrainCircuit, Copy, Check } from 'lucide-react';

const TOOLS: { id: ToolId; icon: React.ElementType }[] = [
  { id: 'aistudio', icon: Sparkles },
  { id: 'cursor', icon: Terminal },
  { id: 'claude', icon: Bot },
  { id: 'chatgpt', icon: Cpu },
  { id: 'vscode', icon: Code2 },
  { id: 'copilot', icon: Command },
  { id: 'langchain', icon: BrainCircuit },
];

const HighlightText: React.FC<{ text: string, highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() 
          ? <span key={i} className="bg-amber-300 text-amber-950 dark:bg-amber-500/60 dark:text-amber-50 font-extrabold rounded px-1 py-0.5 shadow-sm mx-0.5">{part}</span> 
          : part
      )}
    </span>
  );
};

const SidebarGlossaryItem: React.FC<{ term: string, def: string }> = ({ term, def }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(term);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="text-sm group/term relative">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{term}</span>
        <button
          onClick={handleCopy}
          className={`
            p-1 rounded transition-all duration-200
            ${copied 
              ? 'text-green-500 opacity-100 bg-green-50 dark:bg-green-900/20' 
              : 'text-gray-400 opacity-0 group-hover/term:opacity-100 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }
          `}
          title="Copy term"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <span className="text-gray-600 dark:text-gray-400 leading-snug block">{def}</span>
    </li>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  
  // Tooltip state for sidebar
  const [hoveredTool, setHoveredTool] = useState<{ id: string; top: number; right: number } | null>(null);

  // Ref for search input to focus it via shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle HTML dir attribute for RTL
  useEffect(() => {
    const isRTL = lang === Language.HE;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle Dark Mode Class on Body/HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      if (hash && DATA[Language.EN].tutorials[hash as ToolId]) {
        setSelectedToolId(hash as ToolId);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update Hash when tool changes
  useEffect(() => {
    if (selectedToolId) {
      window.location.hash = selectedToolId;
      setGlossarySearch(''); // Reset glossary search when tool changes
    }
  }, [selectedToolId]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+S (Search)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Check for Ctrl+Shift+T (Theme)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault();
        setIsDark(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentData = DATA[lang];
  const ui = currentData.ui;

  // Filter tools based on search query
  const filteredTools = TOOLS.filter(tool => {
    const toolData = currentData.tutorials[tool.id];
    const query = searchQuery.toLowerCase();
    return toolData.name.toLowerCase().includes(query) || 
           toolData.description.toLowerCase().includes(query);
  });

  const selectedToolData = selectedToolId ? currentData.tutorials[selectedToolId] : null;

  // Calculate relevant glossary terms for the sidebar
  const relevantGlossaryTerms = selectedToolData 
    ? Object.entries(GLOSSARY).filter(([term]) => {
        // Check if the term exists in the sections code or content
        return selectedToolData.sections.some(s => 
          s.content.includes(term) || (s.code && s.code.includes(term))
        );
      }) 
    : [];

  // Filter glossary terms based on internal search
  const displayedGlossaryTerms = relevantGlossaryTerms.filter(([term, def]) => 
    term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
    def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // Derive related tools (simple logic: random 3 that are not the current one)
  const relatedTools: RelatedTool[] = selectedToolId 
    ? TOOLS
        .filter(t => t.id !== selectedToolId)
        .slice(0, 3)
        .map(t => ({
          id: t.id,
          name: currentData.tutorials[t.id].name,
          description: currentData.tutorials[t.id].description
        }))
    : [];

  const SidebarLinks = (
    <div className="flex flex-col h-full relative">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Search Bar */}
        <div className="relative group/search">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder={ui.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-colors"
            title="Shortcut: Ctrl+Shift+S"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover/search:opacity-100 transition-opacity">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
              Ctrl+Shift+S
            </kbd>
          </div>
        </div>

        <nav className="space-y-1" onMouseLeave={() => setHoveredTool(null)}>
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {ui.selectTool}
          </div>
          {filteredTools.map((tool) => {
            const toolData = currentData.tutorials[tool.id];
            const isActive = selectedToolId === tool.id;
            const Icon = tool.icon;
            
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredTool({ 
                    id: tool.id, 
                    top: rect.top,
                    right: rect.right
                  });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-left relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                     <HighlightText text={toolData.name} highlight={searchQuery} />
                  </div>
                  <div className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-500'}`}>
                    <HighlightText text={toolData.description} highlight={searchQuery} />
                  </div>
                </div>
              </button>
            );
          })}
          {filteredTools.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tools found
            </div>
          )}
        </nav>
      </div>

      {/* Sidebar Footer Info Panel (Collapsible) */}
      {selectedToolData && (
        <div className="bg-white dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-700 transition-all flex flex-col">
          {/* About This Tool */}
          <div className="border-b border-gray-100 dark:border-slate-700/50">
            <button 
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              className="w-full flex items-center justify-between p-3 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{ui.aboutTool}</span>
              </div>
              {isDescriptionOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${isDescriptionOpen ? 'max-h-40' : 'max-h-0'}`}>
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                 <HighlightText text={selectedToolData.description} highlight={searchQuery} />
              </div>
            </div>
          </div>

          {/* Relevant Terms */}
          {relevantGlossaryTerms.length > 0 && (
            <div>
              <button 
                onClick={() => setIsGlossaryOpen(!isGlossaryOpen)}
                className="w-full flex items-center justify-between p-3 text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Book size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Related Terms</span>
                </div>
                {isGlossaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>

              <div className={`overflow-hidden transition-all duration-300 flex flex-col ${isGlossaryOpen ? 'max-h-60' : 'max-h-0'}`}>
                 {/* Glossary Search */}
                 <div className="px-3 pb-2">
                   <input 
                      type="text" 
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="Filter terms..."
                      className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-purple-500"
                   />
                 </div>
                 
                 <ul className="px-4 pb-4 space-y-3 overflow-y-auto custom-scrollbar">
                  {displayedGlossaryTerms.map(([term, def]) => (
                    <SidebarGlossaryItem key={term} term={term} def={def} />
                  ))}
                  {displayedGlossaryTerms.length === 0 && (
                    <li className="text-xs text-gray-500 italic text-center py-2">No terms match filter</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Tooltip next to sidebar */}
      {hoveredTool && !selectedToolId && (
        <div 
          className="fixed z-50 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl pointer-events-none animate-fade-in hidden md:block"
          style={{ top: hoveredTool.top, left: hoveredTool.right + 10 }}
        >
          <div className="font-bold text-sm mb-1">{currentData.tutorials[hoveredTool.id as ToolId].name}</div>
          <div className="text-xs text-gray-300 leading-snug">
            {currentData.tutorials[hoveredTool.id as ToolId].description}
          </div>
          {/* Arrow */}
          <div className="absolute top-4 -left-1 w-2 h-2 bg-slate-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );

  return (
    <Layout
      currentLang={lang}
      onLangChange={setLang}
      isDark={isDark}
      onThemeToggle={() => setIsDark(!isDark)}
      sidebarContent={SidebarLinks}
      strings={ui}
    >
      {selectedToolId ? (
        <ToolTutorialView 
          key={selectedToolId} 
          tutorial={currentData.tutorials[selectedToolId]} 
          ui={ui} 
          relatedTools={relatedTools}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
              {ui.welcomeTitle}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {ui.welcomeSubtitle}
            </p>
          </div>
          
          <div className="w-full max-w-4xl mt-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
              {ui.popularTools}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredTools.map((tool) => {
                 const toolData = currentData.tutorials[tool.id];
                 const Icon = tool.icon;
                 return (
                  <div 
                    key={tool.id} 
                    className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedToolId(tool.id)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <HighlightText text={toolData.name} highlight={searchQuery} />
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      <HighlightText text={toolData.description} highlight={searchQuery} />
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      Start Learning <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                 );
              })}
            </div>
             {filteredTools.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 italic">No matching tools found.</div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}