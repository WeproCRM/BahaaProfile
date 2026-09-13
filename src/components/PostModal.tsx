import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Smile,
  Send,
  Pin,
  Edit,
  Trash2,
  Quote,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { PostItem } from '../types';

export const PostModal: React.FC<{ post: PostItem; onClose: () => void }> = ({
  post,
  onClose,
}) => {
  const {
    profile,
    toggleLikePost,
    toggleSavePost,
    addCommentToPost,
    deletePost,
    updatePost,
    openModal,
    isAdminMode,
  } = useInstagram();

  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPost(post.id, commentText, commentAuthor.trim() || undefined);
    setCommentText('');
  };

  const handleTogglePin = () => {
    updatePost(post.id, { isPinned: !post.isPinned });
    setShowOptions(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      onClose();
    }
  };

  return (
    <div
      id="post-detail-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6"
    >
      {/* Close button */}
      <button
        id="post-modal-close-btn"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 rounded-full focus:outline-none z-50"
        aria-label="Close dialog"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Card */}
      <div
        id="post-detail-card"
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
      >
        {/* LEFT: Media Container */}
        <div className="w-full md:w-[58%] bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          {post.mediaType === 'thought' ? (
            <div
              style={{
                background:
                  post.thoughtBackground ||
                  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              }}
              className="w-full h-full min-h-[360px] md:min-h-[500px] flex flex-col justify-center items-center text-center p-8 text-white relative"
            >
              <Quote className="w-12 h-12 text-white/40 mb-4" />
              {post.thoughtMood && (
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-3">
                  {post.thoughtMood}
                </span>
              )}
              <p className="text-lg sm:text-2xl font-serif italic max-w-md leading-relaxed drop-shadow-sm">
                {post.caption}
              </p>
              <div className="mt-8 text-xs text-white/60 tracking-wider">
                — {profile.displayName}
              </div>
            </div>
          ) : post.mediaType === 'video' ? (
            <video
              src={post.mediaUrl}
              poster={post.videoThumbnail}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[75vh] object-contain"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[75vh] object-contain"
            />
          )}
        </div>

        {/* RIGHT: Header, Comments, Actions & Input */}
        <div className="w-full md:w-[42%] flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212]">
          {/* Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
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
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5 rotate-45" /> Pinned
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

            {/* Options dropdown button */}
            <div className="relative">
              <button
                id="post-options-menu-btn"
                onClick={() => setShowOptions(!showOptions)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Post options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showOptions && (
                <div
                  id="post-options-dropdown"
                  className="absolute right-0 top-8 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                >
                  {isAdminMode && (
                    <>
                      <button
                        onClick={() => {
                          setShowOptions(false);
                          openModal('edit-post', post);
                        }}
                        className="w-full px-3.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                        <span>Edit Post</span>
                      </button>

                      <button
                        onClick={handleTogglePin}
                        className="w-full px-3.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Pin className="w-4 h-4 text-amber-500" />
                        <span>{post.isPinned ? 'Unpin from Top' : 'Pin to Top of Grid'}</span>
                      </button>

                      <button
                        onClick={handleDelete}
                        className="w-full px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      setShowOptions(false);
                      alert('Post link copied to clipboard!');
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments and Caption Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] md:max-h-[380px]" id="post-comments-scroll-area">
            {/* Main Author Caption (if not thought) */}
            {post.mediaType !== 'thought' && (
              <div className="flex items-start gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="text-xs sm:text-sm leading-relaxed text-neutral-900 dark:text-neutral-100">
                  <span className="font-semibold mr-1.5">{profile.username}</span>
                  <span className="whitespace-pre-line">{post.caption}</span>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs text-[#00376b] dark:text-[#72a7e7] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-400 font-mono mt-2">
                    {post.createdAt}
                  </div>
                </div>
              </div>
            )}

            {/* List of comments */}
            {post.comments.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                No comments yet. Start the conversation!
              </div>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-3 group" id={`comment-${c.id}`}>
                  <img
                    src={c.userAvatar}
                    alt={c.username}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 text-xs leading-relaxed">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">
                      {c.username}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200">{c.text}</span>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                      <span>{c.createdAt}</span>
                      {c.likes > 0 && <span>{c.likes} likes</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Bar & Stats */}
          <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  id="modal-like-btn"
                  onClick={() => toggleLikePost(post.id)}
                  className="transition-transform active:scale-125 focus:outline-none"
                  title={post.isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked
                        ? 'fill-rose-500 text-rose-500 animate-pulse'
                        : 'text-neutral-700 dark:text-neutral-200 hover:text-neutral-500'
                    }`}
                  />
                </button>

                <button
                  id="modal-comment-focus-btn"
                  onClick={() => document.getElementById('new-comment-input')?.focus()}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-neutral-500"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>

                <button
                  id="modal-share-link-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-neutral-500"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <button
                id="modal-save-btn"
                onClick={() => toggleSavePost(post.id)}
                className="text-neutral-700 dark:text-neutral-200"
                title={post.isSaved ? 'Remove from Saved' : 'Save'}
              >
                <Bookmark
                  className={`w-6 h-6 ${
                    post.isSaved ? 'fill-neutral-900 dark:fill-white' : ''
                  }`}
                />
              </button>
            </div>

            {/* Likes count & date */}
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              {post.likesCount.toLocaleString()} likes
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
              {post.createdAt}
            </div>
          </div>

          {/* Add Comment Input Form */}
          <form
            onSubmit={handleSendComment}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
            id="modal-comment-form"
          >
            <input
              id="new-comment-input"
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-xs bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />
            <button
              id="submit-comment-btn"
              type="submit"
              disabled={!commentText.trim()}
              className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
