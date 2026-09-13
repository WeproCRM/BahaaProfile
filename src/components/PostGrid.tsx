import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Pin,
  Film,
  Layers,
  Sparkles,
  Plus,
  Play,
  Edit,
  Trash2,
  Bookmark,
  Share2,
  MapPin,
  Quote,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { PostItem } from '../types';

export const PostGrid: React.FC = () => {
  const {
    activePosts,
    activeGrid,
    openModal,
    isAdminMode,
    toggleLikePost,
    toggleSavePost,
    deletePost,
    updatePost,
    profile,
  } = useInstagram();

  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  if (activePosts.length === 0) {
    return (
      <div
        id="empty-grid-state"
        className="w-full py-20 flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          No Posts in {activeGrid?.title || 'This Grid'}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 mb-6">
          {isAdminMode
            ? `Share your first photo, reel, thought, or project to this "${activeGrid?.title}" grid.`
            : `Stay tuned! New moments will be shared to this grid soon.`}
        </p>
        {isAdminMode && (
          <button
            id="empty-state-new-post-btn"
            onClick={() =>
              openModal('create-post', {
                defaultGridId: activeGrid?.id,
              })
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        )}
      </div>
    );
  }

  const layout = activeGrid?.layout || 'grid-square';

  // 1. REELS VERTICAL LAYOUT (9:16)
  if (layout === 'reels-vertical') {
    return (
      <div
        id="reels-vertical-grid"
        className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {activePosts.map(post => (
          <div
            key={post.id}
            id={`post-card-${post.id}`}
            onClick={() => openModal('post-detail', post)}
            onMouseEnter={() => post.mediaType === 'video' && setHoveredVideoId(post.id)}
            onMouseLeave={() => setHoveredVideoId(null)}
            className="group relative rounded-xl overflow-hidden bg-neutral-900 aspect-[9/16] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Media: Video or Thumbnail */}
            {post.mediaType === 'video' ? (
              <div className="w-full h-full relative">
                <video
                  src={post.mediaUrl}
                  poster={post.videoThumbnail || undefined}
                  muted
                  loop
                  playsInline
                  autoPlay={hoveredVideoId === post.id}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 text-white/90 drop-shadow-md">
                  <Film className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <img
                src={post.mediaUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Gradient Overlay & Reel Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              {/* Top tags or Pin */}
              <div className="flex items-center justify-between">
                {post.isPinned ? (
                  <span className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white font-medium flex items-center gap-1">
                    <Pin className="w-3 h-3 rotate-45" /> Pinned
                  </span>
                ) : (
                  <span />
                )}
                {isAdminMode && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 rounded-md p-1 backdrop-blur-xs">
                    <button
                      id={`reel-edit-${post.id}`}
                      onClick={e => {
                        e.stopPropagation();
                        openModal('edit-post', post);
                      }}
                      className="p-1 text-white hover:text-amber-300"
                      title="Edit Post"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`reel-delete-${post.id}`}
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm('Delete this post?')) deletePost(post.id);
                      }}
                      className="p-1 text-white hover:text-rose-400"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom: Play count, Likes, Caption snippet */}
              <div className="text-white space-y-1">
                <p className="text-xs font-medium line-clamp-2 leading-snug drop-shadow-sm">
                  {post.caption}
                </p>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-white/90 pt-1">
                  <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {formatCount(post.viewsCount || post.likesCount * 3 + 120)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : 'fill-white'}`} />
                    {post.likesCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. EDITORIAL FEED / BLOG CARDS LAYOUT
  if (layout === 'editorial-cards') {
    return (
      <div id="editorial-cards-feed" className="max-w-xl mx-auto px-4 py-6 space-y-8">
        {activePosts.map(post => (
          <article
            key={post.id}
            id={`post-card-${post.id}`}
            className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 overflow-hidden shadow-xs transition-colors"
          >
            {/* Post Header: Avatar, Username, Location, Menu */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 to-rose-600">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover bg-white dark:bg-black p-[1px]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {profile.username}
                    </span>
                    {post.isPinned && (
                      <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                        Pinned
                      </span>
                    )}
                  </div>
                  {post.location && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.location}
                    </span>
                  )}
                </div>
              </div>

              {isAdminMode && (
                <div className="flex items-center gap-1 text-neutral-400">
                  <button
                    id={`editorial-edit-${post.id}`}
                    onClick={() => openModal('edit-post', post)}
                    className="p-1.5 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    title="Edit Post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    id={`editorial-delete-${post.id}`}
                    onClick={() => {
                      if (confirm('Delete this post?')) deletePost(post.id);
                    }}
                    className="p-1.5 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Media or Thought Quote Body */}
            {post.mediaType === 'thought' ? (
              <div
                style={{
                  background:
                    post.thoughtBackground ||
                    'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                }}
                className="w-full aspect-square sm:aspect-[4/3] flex flex-col justify-center items-center text-center p-8 text-white relative"
              >
                <Quote className="w-10 h-10 text-white/40 mb-4" />
                {post.thoughtMood && (
                  <span className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-3">
                    {post.thoughtMood}
                  </span>
                )}
                <p className="text-lg sm:text-xl font-serif italic max-w-md leading-relaxed drop-shadow-sm">
                  {post.caption}
                </p>
                <div className="mt-6 text-xs text-white/60 tracking-wider">
                  — {profile.displayName}
                </div>
              </div>
            ) : post.mediaType === 'video' ? (
              <div className="w-full bg-black relative aspect-[4/5] sm:aspect-square">
                <video
                  src={post.mediaUrl}
                  poster={post.videoThumbnail}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-full bg-neutral-100 dark:bg-neutral-900 cursor-pointer overflow-hidden"
                onClick={() => openModal('post-detail', post)}
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    id={`editorial-like-btn-${post.id}`}
                    onClick={() => toggleLikePost(post.id)}
                    className="transition-transform active:scale-125 focus:outline-none"
                    title={post.isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        post.isLiked
                          ? 'fill-rose-500 text-rose-500 animate-pulse'
                          : 'text-neutral-700 dark:text-neutral-200 hover:text-neutral-500'
                      }`}
                    />
                  </button>

                  <button
                    id={`editorial-comment-btn-${post.id}`}
                    onClick={() => openModal('post-detail', post)}
                    className="text-neutral-700 dark:text-neutral-200 hover:text-neutral-500 focus:outline-none"
                    title="View Comments"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  <button
                    id={`editorial-share-btn-${post.id}`}
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('Post link copied to clipboard!');
                    }}
                    className="text-neutral-700 dark:text-neutral-200 hover:text-neutral-500 focus:outline-none"
                    title="Share Post"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <button
                  id={`editorial-save-btn-${post.id}`}
                  onClick={() => toggleSavePost(post.id)}
                  className="text-neutral-700 dark:text-neutral-200 focus:outline-none"
                  title={post.isSaved ? 'Remove from Saved' : 'Save'}
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      post.isSaved ? 'fill-neutral-900 dark:fill-white' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Likes Count */}
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {post.likesCount.toLocaleString()} likes
              </div>

              {/* Caption (if not thought card) */}
              {post.mediaType !== 'thought' && (
                <div className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">
                  <span className="font-semibold mr-1.5">{profile.username}</span>
                  <span className="whitespace-pre-line">{post.caption}</span>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-[#00376b] dark:text-[#72a7e7] hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments link */}
              {post.comments.length > 0 && (
                <button
                  id={`view-comments-btn-${post.id}`}
                  onClick={() => openModal('post-detail', post)}
                  className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 block pt-1"
                >
                  View all {post.comments.length} comments
                </button>
              )}

              {/* Timestamp */}
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono pt-1">
                {post.createdAt}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  // 3. CLASSIC 3-COLUMN INSTAGRAM SQUARE / MASONRY GRID (Default)
  return (
    <div
      id="main-posts-grid"
      className="max-w-4xl mx-auto px-1 sm:px-4 py-2 sm:py-4 grid grid-cols-3 gap-1 sm:gap-6"
    >
      {activePosts.map(post => (
        <div
          key={post.id}
          id={`post-card-${post.id}`}
          onClick={() => openModal('post-detail', post)}
          className="group relative aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-pointer select-none rounded-none sm:rounded-lg"
        >
          {/* Media Content */}
          {post.mediaType === 'thought' ? (
            <div
              style={{
                background:
                  post.thoughtBackground ||
                  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              }}
              className="w-full h-full flex flex-col justify-center items-center p-3 sm:p-5 text-center text-white"
            >
              <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 mb-1" />
              <p className="text-[11px] sm:text-xs font-medium line-clamp-4 leading-tight italic">
                {post.caption}
              </p>
            </div>
          ) : post.mediaType === 'video' ? (
            <div className="w-full h-full relative">
              <img
                src={post.videoThumbnail || post.mediaUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {/* Top Right Corner Type Indicator (Video / Carousel / Pin) */}
          <div className="absolute top-2 right-2 flex items-center gap-1 drop-shadow-md text-white pointer-events-none">
            {post.isPinned && <Pin className="w-4 h-4 fill-white rotate-45" />}
            {post.mediaType === 'video' && <Film className="w-4 h-4" />}
            {post.mediaType === 'carousel' && <Layers className="w-4 h-4" />}
          </div>

          {/* Hover Overlay: Dark backdrop + Like & Comment counts */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 sm:gap-6 text-white font-semibold text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>{post.comments.length}</span>
            </div>

            {/* Quick action buttons in Admin mode */}
            {isAdminMode && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-md p-1">
                <button
                  id={`grid-edit-${post.id}`}
                  onClick={e => {
                    e.stopPropagation();
                    openModal('edit-post', post);
                  }}
                  className="p-1 text-white hover:text-amber-300 transition-colors"
                  title="Edit Post"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`grid-delete-${post.id}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm('Delete this post?')) deletePost(post.id);
                  }}
                  className="p-1 text-white hover:text-rose-400 transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

function formatCount(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
