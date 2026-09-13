import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppExportData, GridPage, HighlightItem, PostItem, UserProfile } from '../types';
import { INITIAL_GRIDS, INITIAL_HIGHLIGHTS, INITIAL_POSTS, INITIAL_PROFILE } from '../data/initialData';

interface ModalState {
  type: 'post-detail' | 'create-post' | 'edit-post' | 'admin' | 'story' | 'github-pages' | null;
  data?: any;
}

interface InstagramContextType {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  grids: GridPage[];
  addGridPage: (grid: Omit<GridPage, 'id' | 'order' | 'isDeletable'>) => GridPage;
  updateGridPage: (id: string, grid: Partial<GridPage>) => void;
  deleteGridPage: (id: string) => boolean;
  activeGridId: string;
  setActiveGridId: (id: string) => void;
  activeGrid: GridPage | undefined;
  posts: PostItem[];
  activePosts: PostItem[];
  addPost: (post: Omit<PostItem, 'id' | 'createdAt' | 'likesCount' | 'comments'>) => PostItem;
  updatePost: (id: string, updated: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  toggleLikePost: (id: string) => void;
  toggleSavePost: (id: string) => void;
  addCommentToPost: (postId: string, text: string, username?: string) => void;
  highlights: HighlightItem[];
  addHighlight: (hl: Omit<HighlightItem, 'id'>) => HighlightItem;
  updateHighlight: (id: string, hl: Partial<HighlightItem>) => void;
  deleteHighlight: (id: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toggleAdminMode: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  modal: ModalState;
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const STORAGE_KEYS = {
  PROFILE: 'insta_profile_v2',
  GRIDS: 'insta_grids_v2',
  POSTS: 'insta_posts_v2',
  HIGHLIGHTS: 'insta_highlights_v2',
  THEME: 'insta_theme_v2',
  ADMIN: 'insta_admin_mode_v2',
  ACTIVE_GRID: 'insta_active_grid_v2',
};

const InstagramContext = createContext<InstagramContextType | null>(null);

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN);
      return saved !== null ? JSON.parse(saved) : true; // default to true so user sees instant creator powers!
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(isAdminMode));
    } catch (e) {
      console.error(e);
    }
  }, [isAdminMode]);

  const toggleAdminMode = () => setIsAdminMode(prev => !prev);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Grids state
  const [grids, setGrids] = useState<GridPage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRIDS);
      return saved ? JSON.parse(saved) : INITIAL_GRIDS;
    } catch {
      return INITIAL_GRIDS;
    }
  });

  const [activeGridId, setActiveGridId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_GRID);
      return saved || 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRIDS, JSON.stringify(grids));
    } catch (e) {
      console.error(e);
    }
  }, [grids]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GRID, activeGridId);
    } catch (e) {
      console.error(e);
    }
  }, [activeGridId]);

  // Posts state
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  // Highlights state
  const [highlights, setHighlights] = useState<HighlightItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return saved ? JSON.parse(saved) : INITIAL_HIGHLIGHTS;
    } catch {
      return INITIAL_HIGHLIGHTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (e) {
      console.error(e);
    }
  }, [highlights]);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modal manager
  const [modal, setModal] = useState<ModalState>({ type: null });
  const openModal = (type: ModalState['type'], data?: any) => setModal({ type, data });
  const closeModal = () => setModal({ type: null });

  // Grid operations
  const addGridPage = (gridData: Omit<GridPage, 'id' | 'order' | 'isDeletable'>): GridPage => {
    const newId = 'grid-' + Date.now();
    const newGrid: GridPage = {
      ...gridData,
      id: newId,
      order: grids.length + 1,
      isDeletable: true,
    };
    setGrids(prev => [...prev, newGrid]);
    setActiveGridId(newId);
    return newGrid;
  };

  const updateGridPage = (id: string, updated: Partial<GridPage>) => {
    setGrids(prev => prev.map(g => (g.id === id ? { ...g, ...updated } : g)));
  };

  const deleteGridPage = (id: string): boolean => {
    if (grids.length <= 1) {
      return false; // must keep at least 1 grid
    }
    const target = grids.find(g => g.id === id);
    if (!target) return false;

    // Remove from grids list
    setGrids(prev => prev.filter(g => g.id !== id));

    // If active, switch to first remaining grid
    if (activeGridId === id) {
      const remaining = grids.filter(g => g.id !== id);
      if (remaining.length > 0) {
        setActiveGridId(remaining[0].id);
      }
    }

    // Clean up posts: if post had only this grid, move it to remaining first grid, else remove this gridId
    setPosts(prev =>
      prev.map(p => {
        if (p.gridIds.includes(id)) {
          const nextGridIds = p.gridIds.filter(gid => gid !== id);
          return {
            ...p,
            gridIds: nextGridIds.length > 0 ? nextGridIds : ['default'],
          };
        }
        return p;
      })
    );

    return true;
  };

  // Post operations
  const addPost = (postData: Omit<PostItem, 'id' | 'createdAt' | 'likesCount' | 'comments'>): PostItem => {
    const newPost: PostItem = {
      ...postData,
      id: 'post-' + Date.now(),
      createdAt: 'JUST NOW',
      likesCount: 0,
      comments: [],
      isLiked: false,
      isSaved: false,
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: string, updated: Partial<PostItem>) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    // If modal is open with this post, update modal data too
    if (modal.type === 'post-detail' && modal.data?.id === id) {
      setModal(prev => ({ ...prev, data: { ...prev.data, ...updated } }));
    }
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (modal.type === 'post-detail' && modal.data?.id === id) {
      closeModal();
    }
  };

  const toggleLikePost = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          const likesCount = isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          return { ...p, isLiked, likesCount };
        }
        return p;
      })
    );
    if (modal.type === 'post-detail' && modal.data?.id === id) {
      setModal(prev => {
        const isLiked = !prev.data.isLiked;
        const likesCount = isLiked ? prev.data.likesCount + 1 : Math.max(0, prev.data.likesCount - 1);
        return { ...prev, data: { ...prev.data, isLiked, likesCount } };
      });
    }
  };

  const toggleSavePost = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
    if (modal.type === 'post-detail' && modal.data?.id === id) {
      setModal(prev => ({
        ...prev,
        data: { ...prev.data, isSaved: !prev.data.isSaved },
      }));
    }
  };

  const addCommentToPost = (postId: string, text: string, username = profile.username) => {
    if (!text.trim()) return;
    const newComment = {
      id: 'c-' + Date.now(),
      username: username,
      userAvatar: profile.avatarUrl,
      text: text.trim(),
      createdAt: 'Just now',
      likes: 0,
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    if (modal.type === 'post-detail' && modal.data?.id === postId) {
      setModal(prev => ({
        ...prev,
        data: {
          ...prev.data,
          comments: [...(prev.data.comments || []), newComment],
        },
      }));
    }
  };

  // Highlights operations
  const addHighlight = (hlData: Omit<HighlightItem, 'id'>): HighlightItem => {
    const newHl: HighlightItem = {
      ...hlData,
      id: 'hl-' + Date.now(),
    };
    setHighlights(prev => [...prev, newHl]);
    return newHl;
  };

  const updateHighlight = (id: string, updated: Partial<HighlightItem>) => {
    setHighlights(prev => prev.map(h => (h.id === id ? { ...h, ...updated } : h)));
  };

  const deleteHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  // Computed active grid & filtered posts
  const activeGrid = useMemo(() => {
    return grids.find(g => g.id === activeGridId) || grids[0];
  }, [grids, activeGridId]);

  const activePosts = useMemo(() => {
    if (!activeGrid) return [];
    let filtered = posts.filter(p => p.gridIds.includes(activeGrid.id));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.caption.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort: pinned first, then by creation order
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [posts, activeGrid, searchQuery]);

  // Export / Import
  const exportDataJSON = (): string => {
    const payload: AppExportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      grids,
      posts,
      highlights,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data: AppExportData = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.grids && Array.isArray(data.grids)) {
        setGrids(data.grids);
        if (data.grids.length > 0) setActiveGridId(data.grids[0].id);
      }
      if (data.posts && Array.isArray(data.posts)) setPosts(data.posts);
      if (data.highlights && Array.isArray(data.highlights)) setHighlights(data.highlights);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setProfile(INITIAL_PROFILE);
    setGrids(INITIAL_GRIDS);
    setPosts(INITIAL_POSTS);
    setHighlights(INITIAL_HIGHLIGHTS);
    setActiveGridId('default');
  };

  return (
    <InstagramContext.Provider
      value={{
        profile,
        updateProfile,
        grids,
        addGridPage,
        updateGridPage,
        deleteGridPage,
        activeGridId,
        setActiveGridId,
        activeGrid,
        posts,
        activePosts,
        addPost,
        updatePost,
        deletePost,
        toggleLikePost,
        toggleSavePost,
        addCommentToPost,
        highlights,
        addHighlight,
        updateHighlight,
        deleteHighlight,
        isAdminMode,
        setIsAdminMode,
        toggleAdminMode,
        theme,
        toggleTheme,
        modal,
        openModal,
        closeModal,
        exportDataJSON,
        importDataJSON,
        resetToDefaults,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </InstagramContext.Provider>
  );
};

export const useInstagram = () => {
  const context = useContext(InstagramContext);
  if (!context) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};
