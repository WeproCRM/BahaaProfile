import React from 'react';
import {
  InstagramProvider,
  useInstagram,
} from './context/InstagramContext';
import { Navbar } from './components/Navbar';
import { ProfileHeader } from './components/ProfileHeader';
import { GridTabBar } from './components/GridTabBar';
import { PostGrid } from './components/PostGrid';
import { PostModal } from './components/PostModal';
import { CreatePostModal } from './components/CreatePostModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import {
  Plus,
  Home,
  Search,
  PlusSquare,
  Film,
  User,
  Sliders,
  Sparkles,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    modal,
    closeModal,
    openModal,
    isAdminMode,
    profile,
    setActiveGridId,
  } = useInstagram();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-pink-500/20">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full pb-20 sm:pb-12" id="main-app-container">
        {/* Creator Studio notification banner when in editing mode */}
        {isAdminMode && (
          <aside
            id="admin-status-banner"
            aria-label="Creator Studio Status"
            className="w-full bg-gradient-to-r from-purple-900/15 via-pink-900/15 to-purple-900/15 border-b border-pink-500/20 py-1.5 px-4 text-center text-xs text-pink-700 dark:text-pink-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              <strong>Creator Studio Active:</strong> You can add posts, create or delete custom grids, and customize your profile in real-time.
            </span>
            <button
              onClick={() => openModal('admin')}
              className="underline font-semibold hover:opacity-80 ml-1"
            >
              Open Studio Panel &rarr;
            </button>
          </aside>
        )}

        {/* Profile Header & Highlights */}
        <ProfileHeader />

        {/* Grid Pages Tabs & Controls */}
        <GridTabBar />

        {/* Posts Gallery for Active Grid */}
        <PostGrid />
      </main>

      {/* Floating Action Button for Creator Mode */}
      {isAdminMode && (
        <button
          id="floating-create-post-btn"
          onClick={() => openModal('create-post')}
          className="fixed bottom-18 sm:bottom-8 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          title="Create New Post"
          aria-label="Create New Post"
        >
          <Plus className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
            New Post
          </span>
        </button>
      )}

      {/* Mobile Bottom Navigation Bar (Instagram Style) */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 h-13 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around px-2 text-neutral-800 dark:text-neutral-200"
      >
        <button
          id="mobile-nav-home"
          onClick={() => {
            setActiveGridId('default');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-2"
          aria-label="Home Feed"
        >
          <Home className="w-5 h-5" />
        </button>

        <button
          id="mobile-nav-reels"
          onClick={() => {
            setActiveGridId('videos');
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
          className="p-2"
          aria-label="Reels & Video"
        >
          <Film className="w-5 h-5" />
        </button>

        <button
          id="mobile-nav-add"
          onClick={() => openModal('create-post')}
          className="p-2"
          aria-label="Create Post"
        >
          <PlusSquare className="w-5 h-5" />
        </button>

        <button
          id="mobile-nav-admin"
          onClick={() => openModal('admin')}
          className="p-2"
          aria-label="Creator Studio"
        >
          <Sliders className="w-5 h-5" />
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => openModal('admin', { defaultTab: 'profile' })}
          className="p-1"
          aria-label="Profile Settings"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700">
            <img
              src={profile.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </nav>

      {/* MODALS */}
      {modal.type === 'post-detail' && modal.data && (
        <PostModal post={modal.data} onClose={closeModal} />
      )}

      {modal.type === 'create-post' && (
        <CreatePostModal
          defaultGridId={modal.data?.defaultGridId}
          onClose={closeModal}
        />
      )}

      {modal.type === 'edit-post' && modal.data && (
        <CreatePostModal
          initialPost={modal.data}
          onClose={closeModal}
        />
      )}

      {modal.type === 'admin' && (
        <AdminPanelModal
          defaultTab={modal.data?.defaultTab || 'grids'}
          openNewGridForm={modal.data?.openNewGridForm}
          onClose={closeModal}
        />
      )}

      {modal.type === 'story' && modal.data && (
        <StoryViewerModal
          highlight={modal.data}
          onClose={closeModal}
        />
      )}

      {modal.type === 'github-pages' && (
        <GitHubPagesModal onClose={closeModal} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <InstagramProvider>
      <AppContent />
    </InstagramProvider>
  );
}
