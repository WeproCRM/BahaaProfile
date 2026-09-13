import React, { useState } from 'react';
import {
  BadgeCheck,
  Link as LinkIcon,
  Plus,
  Settings,
  Share2,
  Camera,
  Check,
  Sparkles,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const ProfileHeader: React.FC = () => {
  const {
    profile,
    posts,
    highlights,
    openModal,
    isAdminMode,
  } = useInstagram();

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const hasStories = highlights.length > 0;
  const firstHighlight = highlights[0];

  return (
    <section id="profile-header-section" className="w-full max-w-4xl mx-auto px-4 pt-6 pb-4">
      {/* Top Main Section: Avatar + Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
        {/* Avatar with Story gradient border */}
        <div className="relative group mx-auto sm:mx-0 shrink-0" id="profile-avatar-container">
          <div
            onClick={() => {
              if (hasStories) {
                openModal('story', firstHighlight);
              } else {
                openModal('admin', { defaultTab: 'profile' });
              }
            }}
            className="w-24 h-24 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] to-[#962fbf] cursor-pointer transition-transform hover:scale-[1.02] shadow-sm"
            title={hasStories ? 'Click to view Stories' : 'Click to update profile'}
          >
            <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-neutral-200 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Quick change photo badge in creator mode */}
          {isAdminMode && (
            <button
              id="profile-avatar-edit-overlay-btn"
              onClick={e => {
                e.stopPropagation();
                openModal('admin', { defaultTab: 'profile' });
              }}
              className="absolute bottom-1 right-1 p-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full shadow-lg hover:scale-110 transition-transform"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Profile Details & Controls */}
        <div className="flex-1 w-full flex flex-col gap-4" id="profile-info-column">
          {/* Row 1: Username, Badges & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-normal text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5" id="profile-username">
              {profile.username}
              {profile.isVerified && (
                <span title="Verified Creator" className="text-blue-500 inline-flex items-center">
                  <BadgeCheck className="w-5 h-5 fill-blue-500 text-white dark:text-black" />
                </span>
              )}
            </h1>

            {profile.pronouns && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-md font-mono" id="profile-pronouns-tag">
                {profile.pronouns}
              </span>
            )}

            {/* Actions for Creator / Visitor */}
            <div className="flex items-center gap-2 ml-auto sm:ml-2">
              <button
                id="profile-edit-or-admin-btn"
                onClick={() => openModal('admin', { defaultTab: 'profile' })}
                className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
              >
                {isAdminMode ? 'Edit Profile & Grids' : 'Profile Settings'}
              </button>

              <button
                id="profile-share-btn"
                onClick={handleShare}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors flex items-center gap-1.5"
                title="Share Profile Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                id="profile-settings-btn"
                onClick={() => openModal('admin')}
                className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Creator Studio Admin Panel"
                aria-label="Creator Studio Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Stats (Desktop / Tablet view) */}
          <div className="hidden sm:flex items-center gap-8 text-sm" id="profile-stats-desktop">
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1" id="stat-posts-count">
                {profile.postsCountOverride ?? posts.length}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">posts</span>
            </div>
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1" id="stat-followers-count">
                {profile.followersCount}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">followers</span>
            </div>
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1" id="stat-following-count">
                {profile.followingCount}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">following</span>
            </div>
          </div>

          {/* Row 3: Name, Category, Bio & Link */}
          <div className="flex flex-col gap-1 text-sm" id="profile-bio-container">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100" id="profile-display-name">
              {profile.displayName}
            </div>

            {profile.category && (
              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400" id="profile-category-tag">
                {profile.category}
              </div>
            )}

            <div className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed text-[13px] sm:text-sm mt-1" id="profile-bio-text">
              {profile.bio}
            </div>

            {profile.websiteUrl && (
              <a
                id="profile-website-link"
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00376b] dark:text-[#72a7e7] hover:underline mt-1 w-fit"
              >
                <LinkIcon className="w-3.5 h-3.5 rotate-[-45deg]" />
                <span>{profile.websiteLabel || profile.websiteUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Mobile Stats Bar (Instagram style border-t border-b on mobile) */}
      <div className="sm:hidden flex items-center justify-around py-3 mt-4 border-y border-neutral-200 dark:border-neutral-800 text-center text-xs" id="profile-stats-mobile">
        <div>
          <span className="block font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
            {profile.postsCountOverride ?? posts.length}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">posts</span>
        </div>
        <div>
          <span className="block font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
            {profile.followersCount}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">followers</span>
        </div>
        <div>
          <span className="block font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
            {profile.followingCount}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">following</span>
        </div>
      </div>

      {/* Story Highlights Carousel */}
      <div className="mt-6 pt-2 pb-2 overflow-x-auto no-scrollbar flex items-center gap-4 sm:gap-6" id="story-highlights-tray">
        {highlights.map(hl => (
          <button
            key={hl.id}
            id={`highlight-circle-${hl.id}`}
            onClick={() => openModal('story', hl)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] border border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-all">
              <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black overflow-hidden">
                <img
                  src={hl.coverUrl}
                  alt={hl.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[76px] truncate text-center">
              {hl.title}
            </span>
          </button>
        ))}

        {/* Creator mode: "+ New Highlight" button */}
        {isAdminMode && (
          <button
            id="highlight-add-new-btn"
            onClick={() => openModal('admin', { defaultTab: 'highlights' })}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            title="Create new Highlight Story"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:border-neutral-500 dark:group-hover:border-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors bg-neutral-50 dark:bg-neutral-900/50">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              New
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
