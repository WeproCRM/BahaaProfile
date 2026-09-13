import React from 'react';
import {
  Grid,
  Film,
  Plane,
  Camera,
  Feather,
  Briefcase,
  Sparkles,
  LayoutGrid,
  Columns,
  ListFilter,
  Plus,
  Trash2,
  Settings2,
  Check,
  Bookmark,
  Heart,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { GridPage, GridLayout } from '../types';

export const getGridIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName.toLowerCase()) {
    case 'film':
    case 'video':
    case 'reels':
      return <Film className={className} />;
    case 'plane':
    case 'travel':
      return <Plane className={className} />;
    case 'camera':
    case 'photography':
      return <Camera className={className} />;
    case 'feather':
    case 'thoughts':
    case 'blog':
      return <Feather className={className} />;
    case 'briefcase':
    case 'projects':
    case 'portfolio':
      return <Briefcase className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'bookmark':
      return <Bookmark className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'grid':
    default:
      return <Grid className={className} />;
  }
};

export const GridTabBar: React.FC = () => {
  const {
    grids,
    activeGridId,
    setActiveGridId,
    activeGrid,
    updateGridPage,
    deleteGridPage,
    openModal,
    isAdminMode,
    posts,
  } = useInstagram();

  const handleLayoutChange = (newLayout: GridLayout) => {
    if (activeGrid) {
      updateGridPage(activeGrid.id, { layout: newLayout });
    }
  };

  const handleDeleteActiveGrid = () => {
    if (!activeGrid) return;
    if (grids.length <= 1) {
      alert('You must keep at least one grid page.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete the whole "${activeGrid.title}" grid page? Posts belonging to it will still remain in your other feeds.`
    );
    if (confirmed) {
      deleteGridPage(activeGrid.id);
    }
  };

  return (
    <div id="grid-tab-bar-container" className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        {/* Grids Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-0.5">
          <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar" id="grid-tabs-list">
            {grids.map(grid => {
              const isActive = grid.id === activeGridId;
              const postCount = posts.filter(p => p.gridIds.includes(grid.id)).length;

              return (
                <button
                  key={grid.id}
                  id={`tab-grid-${grid.id}`}
                  onClick={() => setActiveGridId(grid.id)}
                  className={`relative flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold tracking-wider uppercase transition-all shrink-0 select-none ${
                    isActive
                      ? 'text-neutral-900 dark:text-neutral-50 -mt-[1px] border-t-2 border-neutral-900 dark:border-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 border-t-2 border-transparent'
                  }`}
                >
                  {getGridIcon(grid.icon, 'w-4 h-4')}
                  <span>{grid.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-normal ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {postCount}
                  </span>
                </button>
              );
            })}

            {/* Quick "+ New Grid Page" Button */}
            {isAdminMode && (
              <button
                id="tab-add-new-grid-btn"
                onClick={() => openModal('admin', { defaultTab: 'grids', openNewGridForm: true })}
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-lg transition-colors shrink-0 my-auto ml-1 border border-dashed border-pink-300 dark:border-pink-800"
                title="Create a new Grid Page (e.g. Travel, Video, Portfolio, Thoughts)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Grid</span>
              </button>
            )}
          </div>

          {/* Right side: Layout Switcher & Active Grid Controls */}
          {activeGrid && (
            <div className="flex items-center gap-1 py-2 shrink-0" id="grid-layout-controls">
              {/* Layout switcher buttons */}
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg p-0.5 border border-neutral-200 dark:border-neutral-800">
                <button
                  id="layout-square-btn"
                  onClick={() => handleLayoutChange('grid-square')}
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    activeGrid.layout === 'grid-square'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                  title="3x3 Square Grid Layout"
                  aria-label="3x3 Square Grid Layout"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>

                <button
                  id="layout-reels-btn"
                  onClick={() => handleLayoutChange('reels-vertical')}
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    activeGrid.layout === 'reels-vertical'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                  title="9:16 Video / Reels Vertical Layout"
                  aria-label="9:16 Video / Reels Vertical Layout"
                >
                  <Film className="w-3.5 h-3.5" />
                </button>

                <button
                  id="layout-editorial-btn"
                  onClick={() => handleLayoutChange('editorial-cards')}
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    activeGrid.layout === 'editorial-cards'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                  }`}
                  title="Full Feed & Editorial Cards Layout"
                  aria-label="Full Feed & Editorial Cards Layout"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid actions (Edit / Delete active grid) in Admin mode */}
              {isAdminMode && (
                <div className="flex items-center gap-1 ml-1">
                  <button
                    id="active-grid-manage-btn"
                    onClick={() => openModal('admin', { defaultTab: 'grids' })}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    title="Manage / Rename Grid Pages"
                    aria-label="Manage Grid Pages"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>

                  {gridCanBeDeleted(activeGrid, grids.length) && (
                    <button
                      id="active-grid-delete-btn"
                      onClick={handleDeleteActiveGrid}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={`Delete "${activeGrid.title}" grid page`}
                      aria-label="Delete this grid page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Optional Active Grid Description banner / sub-bar */}
        {activeGrid?.description && (
          <div className="py-2.5 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900" id="active-grid-desc-bar">
            <span>{activeGrid.description}</span>
            <span className="font-mono text-[11px] text-neutral-400">
              Layout: {formatLayoutName(activeGrid.layout)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function gridCanBeDeleted(grid: GridPage, totalGrids: number): boolean {
  return totalGrids > 1 && grid.isDeletable !== false;
}

function formatLayoutName(layout: GridLayout): string {
  switch (layout) {
    case 'grid-square':
      return 'Square 3-Column';
    case 'reels-vertical':
      return 'Reels Vertical (9:16)';
    case 'editorial-cards':
      return 'Feed Cards & Blog';
    case 'masonry':
      return 'Editorial Masonry';
    default:
      return layout;
  }
}
