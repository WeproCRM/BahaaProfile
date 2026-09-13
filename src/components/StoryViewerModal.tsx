import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { HighlightItem } from '../types';
import { useInstagram } from '../context/InstagramContext';

interface StoryViewerModalProps {
  highlight: HighlightItem;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ highlight, onClose }) => {
  const { profile } = useInstagram();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stories = highlight.stories || [];
  const currentStory = stories[slideIndex] || stories[0];

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      if (slideIndex < stories.length - 1) {
        setSlideIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [slideIndex, isPaused, stories.length, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex, stories.length]);

  const nextSlide = () => {
    if (slideIndex < stories.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <div
      id="story-viewer-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* Close button */}
      <button
        id="story-close-btn"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 rounded-full z-50"
        aria-label="Close stories"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Story Card */}
      <div
        id="story-slide-card"
        className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
      >
        {/* Progress bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-100 ${
                  idx < slideIndex
                    ? 'w-full'
                    : idx === slideIndex
                    ? 'w-full'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Header: Avatar, Username, Time */}
        <div className="absolute top-7 inset-x-3 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={profile.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-white/40"
            />
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span>{profile.username}</span>
              <span className="text-white/60 font-normal text-[11px]">{currentStory.date}</span>
            </div>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-white/80 hover:text-white"
            aria-label={isPaused ? 'Resume story' : 'Pause story'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Story Media Background */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width * 0.35) {
              prevSlide();
            } else {
              nextSlide();
            }
          }}
        >
          <img
            src={currentStory.mediaUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>

        {/* Bottom Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-6 inset-x-4 z-30 text-center">
            <p className="text-sm font-medium text-white drop-shadow-md bg-black/40 backdrop-blur-xs py-2 px-3 rounded-xl inline-block max-w-full">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Left / Right arrow navigation helpers for desktop */}
        {slideIndex > 0 && (
          <button
            onClick={e => {
              e.stopPropagation();
              prevSlide();
            }}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-40"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {slideIndex < stories.length - 1 && (
          <button
            onClick={e => {
              e.stopPropagation();
              nextSlide();
            }}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-40"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
