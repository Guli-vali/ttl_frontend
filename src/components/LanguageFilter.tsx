'use client';

import { useState, useEffect } from 'react';

interface LanguageFilterProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: string[];
}

export default function LanguageFilter({ 
  selectedLanguage, 
  onLanguageChange, 
  availableLanguages 
}: LanguageFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.language-filter')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="language-filter relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-left font-medium hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span>
          {selectedLanguage === 'all' ? 'Все языки' : selectedLanguage}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          <button
            onClick={() => handleLanguageSelect('all')}
            className={`w-full px-4 py-3 text-left hover:bg-yellow-100 transition-colors ${
              selectedLanguage === 'all' ? 'bg-yellow-200 font-medium' : ''
            }`}
          >
            Все языки
          </button>
          {availableLanguages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageSelect(language)}
              className={`w-full px-4 py-3 text-left hover:bg-yellow-100 transition-colors border-t border-gray-100 ${
                selectedLanguage === language ? 'bg-yellow-200 font-medium' : ''
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
