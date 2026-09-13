import React, { useState } from 'react';
import {
  X,
  Layers,
  FileText,
  User,
  Github,
  Plus,
  Trash2,
  Edit2,
  Check,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Film,
  Camera,
  Plane,
  Feather,
  Briefcase,
  Grid,
  Heart,
  Bookmark,
  BadgeCheck,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { GridPage, GridLayout, HighlightItem } from '../types';
import { getGridIcon } from './GridTabBar';

interface AdminPanelModalProps {
  defaultTab?: 'grids' | 'posts' | 'profile' | 'highlights' | 'github';
  openNewGridForm?: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'grid', label: 'Classic Grid', icon: Grid },
  { id: 'film', label: 'Reels / Video', icon: Film },
  { id: 'plane', label: 'Travel', icon: Plane },
  { id: 'camera', label: 'Photography', icon: Camera },
  { id: 'feather', label: 'Blog / Thoughts', icon: Feather },
  { id: 'briefcase', label: 'Projects / Work', icon: Briefcase },
  { id: 'sparkles', label: 'Sparkles / Art', icon: Sparkles },
  { id: 'heart', label: 'Favorites', icon: Heart },
  { id: 'bookmark', label: 'Saved / Curated', icon: Bookmark },
];

const LAYOUT_OPTIONS: { id: GridLayout; label: string; desc: string }[] = [
  { id: 'grid-square', label: 'Square 3-Column', desc: 'Classic Instagram 1:1 square grid' },
  { id: 'reels-vertical', label: 'Reels & Video (9:16)', desc: 'Tall vertical video cards with play counters' },
  { id: 'editorial-cards', label: 'Feed & Blog Cards', desc: 'Full-width cards for personal thoughts and stories' },
  { id: 'masonry', label: 'Editorial Masonry', desc: 'Portfolio layout respecting varied aspect ratios' },
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  defaultTab = 'grids',
  openNewGridForm = false,
  onClose,
}) => {
  const {
    profile,
    updateProfile,
    grids,
    addGridPage,
    updateGridPage,
    deleteGridPage,
    posts,
    deletePost,
    highlights,
    addHighlight,
    deleteHighlight,
    openModal,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
  } = useInstagram();

  const [activeTab, setActiveTab] = useState<'grids' | 'posts' | 'profile' | 'highlights' | 'github'>(defaultTab);

  // New Grid Form State
  const [showAddGrid, setShowAddGrid] = useState(openNewGridForm);
  const [newGridTitle, setNewGridTitle] = useState('');
  const [newGridIcon, setNewGridIcon] = useState('grid');
  const [newGridLayout, setNewGridLayout] = useState<GridLayout>('grid-square');
  const [newGridDesc, setNewGridDesc] = useState('');

  // Editing Grid state
  const [editingGridId, setEditingGridId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Highlight form state
  const [newHlTitle, setNewHlTitle] = useState('');
  const [newHlCover, setNewHlCover] = useState('');

  // Filter posts in posts tab
  const [postsFilterGrid, setPostsFilterGrid] = useState<string>('all');
  const [postsSearch, setPostsSearch] = useState('');

  // GitHub Pages repo state
  const [ghUsername, setGhUsername] = useState('your-github-username');
  const [ghRepo, setGhRepo] = useState('my-instagram');

  // Handle Create New Grid
  const handleCreateGrid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGridTitle.trim()) {
      alert('Please enter a grid page title.');
      return;
    }
    const slug = newGridTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addGridPage({
      title: newGridTitle.trim(),
      slug,
      icon: newGridIcon,
      layout: newGridLayout,
      description: newGridDesc.trim(),
    });
    setNewGridTitle('');
    setNewGridDesc('');
    setShowAddGrid(false);
  };

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  // Avatar file upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Highlights creation
  const handleCreateHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHlTitle.trim() || !newHlCover.trim()) {
      alert('Please provide a title and cover image for the highlight.');
      return;
    }
    addHighlight({
      title: newHlTitle.trim(),
      coverUrl: newHlCover.trim(),
      stories: [
        {
          id: 'story-' + Date.now(),
          mediaUrl: newHlCover.trim(),
          caption: newHlTitle.trim(),
          date: 'Just now',
        },
      ],
    });
    setNewHlTitle('');
    setNewHlCover('');
  };

  // Export JSON Download
  const handleDownloadJSON = () => {
    const dataStr = exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const success = importDataJSON(reader.result);
        if (success) {
          alert('Data successfully imported and updated!');
          onClose();
        } else {
          alert('Failed to parse the backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="admin-panel-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <div
        id="admin-panel-modal-card"
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                Creator Studio & Admin Panel
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Manage your profile, grids, posts, and GitHub Pages deployment
              </p>
            </div>
          </div>
          <button
            id="close-admin-panel-btn"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Close admin panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-4 gap-2 overflow-x-auto no-scrollbar bg-white dark:bg-neutral-900" id="admin-tabs-nav">
          <button
            id="tab-btn-grids"
            onClick={() => setActiveTab('grids')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'grids'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Grid Pages ({grids.length})</span>
          </button>

          <button
            id="tab-btn-posts"
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manage Posts ({posts.length})</span>
          </button>

          <button
            id="tab-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>

          <button
            id="tab-btn-highlights"
            onClick={() => setActiveTab('highlights')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'highlights'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Story Highlights</span>
          </button>

          <button
            id="tab-btn-github"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub Pages & Export</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" id="admin-tab-content">
          {/* TAB 1: GRIDS & PAGES MANAGER */}
          {activeTab === 'grids' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Your Custom Grid Pages
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Create new grids for travel memories, video reels, photography portfolios, thoughts, or projects. You can add or delete whole grids anytime.
                  </p>
                </div>
                <button
                  id="admin-add-grid-toggle-btn"
                  onClick={() => setShowAddGrid(!showAddGrid)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:opacity-95 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddGrid ? 'Cancel' : 'Create New Grid'}</span>
                </button>
              </div>

              {/* Form to Create New Grid Page */}
              {showAddGrid && (
                <form
                  onSubmit={handleCreateGrid}
                  className="p-4 sm:p-5 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/40 dark:bg-pink-950/20 space-y-4 animate-in fade-in duration-200"
                  id="add-new-grid-form"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
                    New Grid Page Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Page Title (e.g. Travel Memories, 35mm Film, Video Reels)
                      </label>
                      <input
                        id="new-grid-title-input"
                        type="text"
                        value={newGridTitle}
                        onChange={e => setNewGridTitle(e.target.value)}
                        placeholder="e.g. Travel Memories"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Header Tagline / Description (optional)
                      </label>
                      <input
                        id="new-grid-desc-input"
                        type="text"
                        value={newGridDesc}
                        onChange={e => setNewGridDesc(e.target.value)}
                        placeholder="e.g. Postcards, memories and maps from our trips"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Tab Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ICONS.map(item => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setNewGridIcon(item.id)}
                            className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs transition-all ${
                              newGridIcon === item.id
                                ? 'border-pink-600 bg-pink-600 text-white font-semibold'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layout Selection */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Layout Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LAYOUT_OPTIONS.map(lo => (
                        <button
                          key={lo.id}
                          type="button"
                          onClick={() => setNewGridLayout(lo.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            newGridLayout === lo.id
                              ? 'border-pink-600 bg-pink-100/60 dark:bg-pink-950/60 text-neutral-900 dark:text-neutral-100 font-semibold'
                              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="text-xs font-semibold">{lo.label}</div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{lo.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGrid(false)}
                      className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="confirm-create-grid-btn"
                      className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Create Grid Page
                    </button>
                  </div>
                </form>
              )}

              {/* Grid List */}
              <div className="space-y-3" id="admin-grids-list">
                {grids.map(grid => {
                  const postCount = posts.filter(p => p.gridIds.includes(grid.id)).length;
                  const isEditingThis = editingGridId === grid.id;

                  return (
                    <div
                      key={grid.id}
                      id={`grid-row-${grid.id}`}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                          {getGridIcon(grid.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          {isEditingThis ? (
                            <div className="flex flex-col gap-1">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="text-xs font-semibold px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <input
                                type="text"
                                value={editDesc}
                                onChange={e => setEditDesc(e.target.value)}
                                placeholder="Tagline / description"
                                className="text-[11px] px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                  {grid.title}
                                </span>
                                {grid.id === 'default' && (
                                  <span className="text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.2 rounded font-mono">
                                    Primary Feed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {grid.description || 'No description'} •{' '}
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                  {postCount} posts
                                </span>{' '}
                                • Layout: {grid.layout}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isEditingThis ? (
                          <>
                            <button
                              onClick={() => {
                                updateGridPage(grid.id, {
                                  title: editTitle.trim() || grid.title,
                                  description: editDesc.trim(),
                                });
                                setEditingGridId(null);
                              }}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={() => setEditingGridId(null)}
                              className="px-2 py-1 text-xs text-neutral-400"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              id={`edit-grid-btn-${grid.id}`}
                              onClick={() => {
                                setEditingGridId(grid.id);
                                setEditTitle(grid.title);
                                setEditDesc(grid.description || '');
                              }}
                              className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs flex items-center gap-1"
                              title="Rename / Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {grids.length > 1 && (
                              <button
                                id={`delete-grid-btn-${grid.id}`}
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to delete the whole "${grid.title}" grid page?`
                                    )
                                  ) {
                                    deleteGridPage(grid.id);
                                  }
                                }}
                                className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs flex items-center gap-1"
                                title="Delete Whole Grid Page"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete Grid</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: POSTS CONTENT MANAGER */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    All Published Posts ({posts.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Manage, edit, reassign grids, or delete your posts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id="posts-grid-filter-select"
                    value={postsFilterGrid}
                    onChange={e => setPostsFilterGrid(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="all">All Grids</option>
                    {grids.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>

                  <button
                    id="admin-create-post-shortcut-btn"
                    onClick={() => {
                      onClose();
                      openModal('create-post');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Post</span>
                  </button>
                </div>
              </div>

              {/* Posts List */}
              <div className="space-y-2" id="admin-posts-table">
                {posts
                  .filter(
                    p => postsFilterGrid === 'all' || p.gridIds.includes(postsFilterGrid)
                  )
                  .map(post => (
                    <div
                      key={post.id}
                      id={`admin-post-row-${post.id}`}
                      className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/30 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
                          {post.mediaType === 'thought' ? (
                            <span className="text-[10px] text-white font-serif p-1 line-clamp-2">
                              “{post.caption.slice(0, 30)}”
                            </span>
                          ) : post.mediaType === 'video' ? (
                            <img
                              src={post.videoThumbnail || post.mediaUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={post.mediaUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-sm">
                            {post.caption || 'No caption'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                            <span className="capitalize">{post.mediaType}</span>
                            <span>•</span>
                            <span>{post.likesCount} likes</span>
                            <span>•</span>
                            <span>{post.comments.length} comments</span>
                            <span>•</span>
                            <div className="flex gap-1">
                              {post.gridIds.map(gid => {
                                const matchingGrid = grids.find(g => g.id === gid);
                                return (
                                  <span
                                    key={gid}
                                    className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-1 py-0.2 rounded text-[10px]"
                                  >
                                    {matchingGrid?.title || gid}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          id={`admin-edit-post-${post.id}`}
                          onClick={() => {
                            onClose();
                            openModal('edit-post', post);
                          }}
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md text-xs"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`admin-delete-post-${post.id}`}
                          onClick={() => {
                            if (confirm('Delete this post?')) deletePost(post.id);
                          }}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md text-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & BIO SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5" id="admin-profile-form">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Profile Information & Bio
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Customize your avatar, username, bio, links, and verification
                  </p>
                </div>
                {profileSavedToast && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Check className="w-4 h-4" /> Saved!
                  </span>
                )}
              </div>

              {/* Avatar Uploader & Preset */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
                  <img
                    src={profileForm.avatarUrl}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full bg-white dark:bg-black p-[2px]"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="profile-avatar-upload"
                      className="cursor-pointer px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        id="profile-avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setProfileForm(prev => ({
                          ...prev,
                          avatarUrl:
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                        }))
                      }
                      className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
                    >
                      Preset 1
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setProfileForm(prev => ({
                          ...prev,
                          avatarUrl:
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                        }))
                      }
                      className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
                    >
                      Preset 2
                    </button>
                  </div>

                  <input
                    type="url"
                    value={profileForm.avatarUrl}
                    onChange={e => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    placeholder="Or enter direct image URL"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Username Handle
                  </label>
                  <input
                    id="profile-username-input"
                    type="text"
                    value={profileForm.username}
                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Display Name
                  </label>
                  <input
                    id="profile-displayname-input"
                    type="text"
                    value={profileForm.displayName}
                    onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Category Tag (e.g. Photographer, Designer, Writer)
                  </label>
                  <input
                    id="profile-category-input"
                    type="text"
                    value={profileForm.category}
                    onChange={e => setProfileForm({ ...profileForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Pronouns
                  </label>
                  <input
                    id="profile-pronouns-input"
                    type="text"
                    value={profileForm.pronouns || ''}
                    onChange={e => setProfileForm({ ...profileForm, pronouns: e.target.value })}
                    placeholder="they/them, she/her, he/him"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Website URL
                  </label>
                  <input
                    id="profile-website-url-input"
                    type="url"
                    value={profileForm.websiteUrl}
                    onChange={e => setProfileForm({ ...profileForm, websiteUrl: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Website Label Text
                  </label>
                  <input
                    id="profile-website-label-input"
                    type="text"
                    value={profileForm.websiteLabel || ''}
                    onChange={e => setProfileForm({ ...profileForm, websiteLabel: e.target.value })}
                    placeholder="e.g. yourportfolio.com/work"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Followers Count Text
                  </label>
                  <input
                    id="profile-followers-input"
                    type="text"
                    value={profileForm.followersCount}
                    onChange={e => setProfileForm({ ...profileForm, followersCount: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Following Count Text
                  </label>
                  <input
                    id="profile-following-input"
                    type="text"
                    value={profileForm.followingCount}
                    onChange={e => setProfileForm({ ...profileForm, followingCount: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="profile-bio-textarea"
                  rows={4}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell your story, links, locations..."
                  className="w-full text-xs p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Verified Badge Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="profile-verified-checkbox"
                  type="checkbox"
                  checked={profileForm.isVerified}
                  onChange={e => setProfileForm({ ...profileForm, isVerified: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <label
                  htmlFor="profile-verified-checkbox"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                  <span>Display Blue Verified Badge next to username</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs rounded-xl shadow-md hover:opacity-95 transition-opacity"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: STORY HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Profile Story Highlights
                </h3>
                <p className="text-xs text-neutral-500">
                  Add custom circular highlight covers shown under your bio
                </p>
              </div>

              {/* Add Highlight Form */}
              <form
                onSubmit={handleCreateHighlight}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3"
              >
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Add New Highlight Circle
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newHlTitle}
                    onChange={e => setNewHlTitle(e.target.value)}
                    placeholder="Highlight Title (e.g. Kyoto 🇯🇵 or Books 📚)"
                    className="text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    value={newHlCover}
                    onChange={e => setNewHlCover(e.target.value)}
                    placeholder="Cover Image URL (https://...)"
                    className="text-xs px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-semibold"
                  >
                    Add Highlight
                  </button>
                </div>
              </form>

              {/* Existing Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {highlights.map(hl => (
                  <div
                    key={hl.id}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col items-center text-center relative group"
                  >
                    <div className="w-16 h-16 rounded-full p-[2px] border border-neutral-300 dark:border-neutral-700 mb-2 overflow-hidden">
                      <img
                        src={hl.coverUrl}
                        alt={hl.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate w-full">
                      {hl.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {hl.stories.length} stories
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Delete highlight "${hl.title}"?`)) {
                          deleteHighlight(hl.id);
                        }
                      }}
                      className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GITHUB PAGES & DATA BACKUP */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub Pages Deployment & Data Toolkit</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Export your website, deploy effortlessly to GitHub Pages, or save backup data
                </p>
              </div>

              {/* 1. Quick Data Backup & Restore */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Data Portability (1-Click JSON Backup & Restore)
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Download all your grids, posts, profile info, and stories as a single JSON file. You can restore it anytime on any browser or deployment!
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    id="admin-export-json-btn"
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Backup JSON</span>
                  </button>

                  <label
                    htmlFor="import-backup-json"
                    className="cursor-pointer flex items-center gap-2 px-3.5 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore from JSON File</span>
                    <input
                      id="import-backup-json"
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>

                  <button
                    id="admin-reset-defaults-btn"
                    onClick={() => {
                      if (confirm('Reset to initial sample portfolio data?')) {
                        resetToDefaults();
                        alert('Reset to demo sample data!');
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>

              {/* 2. Step-by-step GitHub Pages Publishing Guide */}
              <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  How to Host on Your GitHub Pages (Free, Fast & Automated)
                </h4>

                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                      1
                    </span>
                    <div>
                      <strong>Export Project:</strong> In the top-right Settings menu of AI Studio, click <strong>Export to GitHub</strong> or <strong>Export as ZIP</strong>.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                      2
                    </span>
                    <div>
                      <strong>Push to your GitHub repository:</strong> If using Git locally:
                      <div className="bg-neutral-900 text-neutral-100 p-2.5 rounded-lg font-mono text-[11px] my-1.5 overflow-x-auto">
                        git init<br />
                        git add .<br />
                        git commit -m "My Personal Instagram Portfolio"<br />
                        git branch -M main<br />
                        git remote add origin https://github.com/{ghUsername}/{ghRepo}.git<br />
                        git push -u origin main
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                      3
                    </span>
                    <div>
                      <strong>Enable GitHub Pages in GitHub:</strong> Go to your repository on GitHub &rarr; <strong>Settings</strong> &rarr; <strong>Pages</strong> &rarr; Under <em>Build and deployment / Source</em>, choose <strong>GitHub Actions</strong> (or deploy from branch).
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="open-full-gh-workflow-modal-btn"
                    onClick={() => {
                      onClose();
                      openModal('github-pages');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Actions Workflow & Deploy Script</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
