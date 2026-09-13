import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Quote,
  MapPin,
  Sparkles,
  Pin,
  Check,
  Globe,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { MediaAspect, MediaType, PostItem } from '../types';

interface CreatePostModalProps {
  initialPost?: PostItem;
  defaultGridId?: string;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Kyoto Alley',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Ocean Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Moody Forest',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Street Neon',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=85',
  },
];

const PRESET_VIDEOS = [
  {
    name: 'Fire & Light Cinematic',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Nature & Motion Reel',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Forest Waterfall',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  initialPost,
  defaultGridId,
  onClose,
}) => {
  const { grids, activeGridId, addPost, updatePost } = useInstagram();
  const isEditing = Boolean(initialPost);

  const [mediaType, setMediaType] = useState<MediaType>(initialPost?.mediaType || 'image');
  const [mediaUrl, setMediaUrl] = useState(initialPost?.mediaUrl || PRESET_PHOTOS[0].url);
  const [videoThumbnail, setVideoThumbnail] = useState(initialPost?.videoThumbnail || '');
  const [aspectRatio, setAspectRatio] = useState<MediaAspect>(initialPost?.aspectRatio || '1:1');
  const [selectedGridIds, setSelectedGridIds] = useState<string[]>(
    initialPost?.gridIds || [defaultGridId || activeGridId || 'default']
  );
  const [caption, setCaption] = useState(initialPost?.caption || '');
  const [location, setLocation] = useState(initialPost?.location || '');
  const [tagsInput, setTagsInput] = useState(initialPost?.tags.join(', ') || 'portfolio, visual');
  const [isPinned, setIsPinned] = useState(initialPost?.isPinned || false);

  // Thought styling
  const [thoughtMood, setThoughtMood] = useState(initialPost?.thoughtMood || 'Creative Reflection');
  const [thoughtGradient, setThoughtGradient] = useState(
    initialPost?.thoughtBackground ||
      'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
  );

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleGridSelection = (gridId: string) => {
    setSelectedGridIds(prev =>
      prev.includes(gridId)
        ? prev.length > 1
          ? prev.filter(id => id !== gridId)
          : prev
        : [...prev, gridId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl && mediaType !== 'thought') {
      alert('Please provide an image or video.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (isEditing && initialPost) {
      updatePost(initialPost.id, {
        mediaType,
        mediaUrl: mediaType === 'thought' ? '' : mediaUrl,
        videoThumbnail: mediaType === 'video' ? videoThumbnail : undefined,
        aspectRatio,
        gridIds: selectedGridIds,
        caption,
        location,
        tags,
        isPinned,
        thoughtMood: mediaType === 'thought' ? thoughtMood : undefined,
        thoughtBackground: mediaType === 'thought' ? thoughtGradient : undefined,
      });
    } else {
      addPost({
        mediaType,
        mediaUrl: mediaType === 'thought' ? '' : mediaUrl,
        videoThumbnail: mediaType === 'video' ? videoThumbnail : undefined,
        aspectRatio,
        gridIds: selectedGridIds,
        caption,
        location,
        tags,
        isPinned,
        thoughtMood: mediaType === 'thought' ? thoughtMood : undefined,
        thoughtBackground: mediaType === 'thought' ? thoughtGradient : undefined,
      });
    }

    onClose();
  };

  return (
    <div
      id="create-post-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="create-post-modal-container"
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </span>
          </div>
          <button
            id="close-create-post-btn"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-full"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Choose Content Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="type-image-btn"
                onClick={() => {
                  setMediaType('image');
                  if (!mediaUrl.startsWith('data:') && !mediaUrl.startsWith('http')) {
                    setMediaUrl(PRESET_PHOTOS[0].url);
                  }
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  mediaType === 'image'
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo / Graphic</span>
              </button>

              <button
                type="button"
                id="type-video-btn"
                onClick={() => {
                  setMediaType('video');
                  setMediaUrl(PRESET_VIDEOS[0].url);
                  setVideoThumbnail(PRESET_VIDEOS[0].thumbnail);
                  setAspectRatio('9:16');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  mediaType === 'video'
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Reel / Video</span>
              </button>

              <button
                type="button"
                id="type-thought-btn"
                onClick={() => setMediaType('thought')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  mediaType === 'thought'
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Quote className="w-4 h-4" />
                <span>Thought / Quote</span>
              </button>
            </div>
          </div>

          {/* 2. Media Upload or Selection */}
          {mediaType !== 'thought' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Media Asset
              </label>

              {/* Drag & drop upload button */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="media-file-upload"
                  className="flex-1 cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors bg-neutral-50 dark:bg-neutral-800/50 text-center"
                >
                  <Upload className="w-6 h-6 text-neutral-500 mb-1" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Upload image or video file
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Direct from your camera roll or computer
                  </span>
                  <input
                    id="media-file-upload"
                    type="file"
                    accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Media URL */}
              <div className="space-y-1">
                <span className="text-xs text-neutral-500">Or paste direct media URL:</span>
                <input
                  id="media-url-input"
                  type="url"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full text-xs px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Preset picker */}
              {mediaType === 'image' && (
                <div className="pt-1">
                  <span className="text-[11px] font-medium text-neutral-500 block mb-1.5">
                    Quick Sample Presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {PRESET_PHOTOS.map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setMediaUrl(p.url)}
                        className={`px-2.5 py-1 rounded-md text-[11px] shrink-0 border transition-colors ${
                          mediaUrl === p.url
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Box */}
              {mediaUrl && (
                <div className="w-full max-h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      controls
                      className="max-h-48 w-full object-contain"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-48 w-full object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Thought Card Options */
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Thought Card Theme
              </label>
              <input
                id="thought-mood-input"
                type="text"
                value={thoughtMood}
                onChange={e => setThoughtMood(e.target.value)}
                placeholder="Topic / Category (e.g. On Simplicity, Creative Process)"
                className="w-full text-xs px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />

              <div className="flex gap-2 pt-1">
                {[
                  { name: 'Indigo Deep', val: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' },
                  { name: 'Obsidian Night', val: 'linear-gradient(135deg, #27272a 0%, #18181b 50%, #09090b 100%)' },
                  { name: 'Rose Twilight', val: 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #e11d48 100%)' },
                  { name: 'Emerald Woods', val: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' },
                ].map(grad => (
                  <button
                    key={grad.name}
                    type="button"
                    onClick={() => setThoughtGradient(grad.val)}
                    style={{ background: grad.val }}
                    className={`h-8 flex-1 rounded-lg border-2 text-[10px] text-white font-medium shadow-xs ${
                      thoughtGradient === grad.val ? 'border-white scale-105' : 'border-transparent'
                    }`}
                  >
                    {grad.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Target Grids / Pages (Key feature: Assign to multiple pages or specific grid!) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Select Grid Pages to Publish On
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="post-target-grids-picker">
              {grids.map(g => {
                const isSelected = selectedGridIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    id={`assign-grid-${g.id}`}
                    onClick={() => toggleGridSelection(g.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 text-neutral-900 dark:text-neutral-100 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className="truncate mr-1">{g.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Select one or multiple grids (e.g., Default, Videos, Travel, Photography, etc.).
            </p>
          </div>

          {/* 4. Aspect Ratio & Pin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Display Aspect Ratio
              </label>
              <div className="flex gap-2">
                {(['1:1', '4:5', '16:9', '9:16'] as MediaAspect[]).map(aspect => (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => setAspectRatio(aspect)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                      aspectRatio === aspect
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {aspect}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Pin to Top of Grid
              </label>
              <button
                type="button"
                id="toggle-pin-btn"
                onClick={() => setIsPinned(!isPinned)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                  isPinned
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-500 text-amber-500 rotate-45' : ''}`} />
                <span>{isPinned ? 'Pinned to Top' : 'Not Pinned'}</span>
              </button>
            </div>
          </div>

          {/* 5. Caption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Caption
            </label>
            <textarea
              id="post-caption-textarea"
              rows={4}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write a caption, story, camera settings, or reflection..."
              className="w-full text-xs p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {/* 6. Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location Tag</span>
              </label>
              <input
                id="post-location-input"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Kyoto, Japan or Studio 4B"
                className="w-full text-xs px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                Hashtags (comma-separated)
              </label>
              <input
                id="post-tags-input"
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="travel, photography, 35mm, cinema"
                className="w-full text-xs px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 bg-neutral-50 dark:bg-neutral-900/80">
          <button
            type="button"
            id="cancel-create-post-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit-create-post-btn"
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            {isEditing ? 'Save Changes' : 'Share Post'}
          </button>
        </div>
      </div>
    </div>
  );
};
