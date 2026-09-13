import React from 'react';
import {
  Camera,
  PlusSquare,
  Search,
  Sun,
  Moon,
  Github,
  Sliders,
  Sparkles,
  Heart,
  Send,
  X,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const Navbar: React.FC = () => {
  const {
    profile,
    theme,
    toggleTheme,
    isAdminMode,
    toggleAdminMode,
    openModal,
    searchQuery,
    setSearchQuery,
  } = useInstagram();

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Instagram Logo / Wordmark */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none" id="nav-brand-logo">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] to-[#962fbf] p-[2px] flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-white dark:bg-black rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight font-serif italic text-neutral-900 dark:text-neutral-50 leading-tight">
              Instagram
            </span>
            <span className="text-[10px] tracking-wider uppercase font-medium text-neutral-500 dark:text-neutral-400">
              Personal Edition
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs relative" id="nav-search-container">
          <Search className="w-4 h-4 absolute left-3 text-neutral-400 pointer-events-none" />
          <input
            id="nav-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search posts, tags, places..."
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              id="nav-search-clear-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3" id="nav-actions-group">
          {/* Creator Mode Badge Switch */}
          <button
            id="toggle-admin-mode-btn"
            onClick={toggleAdminMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              isAdminMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
            title="Toggle Creator / Admin Editing Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAdminMode ? 'Creator Studio ON' : 'Visitor View'}</span>
            <span className="md:hidden">{isAdminMode ? 'Studio' : 'View'}</span>
          </button>

          {/* New Post (+) Button */}
          <button
            id="nav-new-post-btn"
            onClick={() => openModal('create-post')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 rounded-lg text-xs font-medium transition-transform active:scale-95 shadow-sm"
            title="Create New Post"
          >
            <PlusSquare className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </button>

          {/* Admin Studio Settings Modal */}
          <button
            id="nav-admin-panel-btn"
            onClick={() => openModal('admin')}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Manage Grids, Content & Profile Settings"
            aria-label="Open Creator Studio Panel"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* GitHub Pages Deploy / Export Helper */}
          <button
            id="nav-github-pages-btn"
            onClick={() => openModal('github-pages')}
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-xs font-medium border border-neutral-200 dark:border-neutral-800"
            title="Deploy to GitHub Pages & Backup"
          >
            <Github className="w-4 h-4" />
            <span className="hidden lg:inline">GitHub Pages</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile Avatar circle */}
          <div
            id="nav-profile-avatar-trigger"
            onClick={() => openModal('admin', { defaultTab: 'profile' })}
            className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 cursor-pointer transition-transform hover:scale-105"
            title={`${profile.displayName} (@${profile.username})`}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full bg-neutral-200 dark:bg-neutral-800"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search input when on tiny screens */}
      <div className="sm:hidden px-4 pb-2.5 pt-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400 pointer-events-none" />
          <input
            id="nav-mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search posts, tags, places..."
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-neutral-400"
              aria-label="Clear mobile search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
