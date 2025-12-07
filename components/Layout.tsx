import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Globe, Mail } from 'lucide-react';
import { Language, ToolId } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  sidebarContent: React.ReactNode;
  strings: any;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentLang,
  onLangChange,
  isDark,
  onThemeToggle,
  sidebarContent,
  strings
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper for flags or language names
  const langLabels: Record<Language, string> = {
    [Language.EN]: "English",
    [Language.HE]: "עברית",
    [Language.ZH]: "中文",
    [Language.HI]: "हिन्दी",
    [Language.ES]: "Español",
    [Language.RU]: "Русский",
  };

  const isRTL = currentLang === Language.HE;

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent truncate">
              Noam Gold AI
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Globe size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {langLabels[currentLang]}
                </span>
              </button>
              
              {/* Dropdown */}
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-48 py-2 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                {Object.values(Language).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLangChange(lang)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 ${currentLang === lang ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {langLabels[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <aside className={`hidden md:block w-64 lg:w-72 border-r dark:border-gray-700 bg-gray-50/50 dark:bg-dark-card/30 overflow-y-auto ${isRTL ? 'border-l border-r-0' : ''}`}>
          {sidebarContent}
        </aside>

        {/* Sidebar (Mobile Overlay) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-3/4 max-w-xs bg-white dark:bg-dark-card shadow-2xl p-4 overflow-y-auto`}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg dark:text-white">{strings.selectTool}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X size={20} className="dark:text-white" />
                </button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-4xl mx-auto min-h-[80vh]">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2 font-medium">{strings.footerRights}</p>
            <a 
              href="mailto:gold.noam@gmail.com" 
              className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Mail size={16} />
              {strings.sendFeedback}: gold.noam@gmail.com
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
};