export type MediaAspect = '1:1' | '4:5' | '16:9' | '9:16';

export type MediaType = 'image' | 'video' | 'carousel' | 'thought';

export type GridLayout = 'grid-square' | 'reels-vertical' | 'editorial-cards' | 'masonry';

export interface CommentItem {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface PostItem {
  id: string;
  gridIds: string[]; // Belongs to which grid pages (e.g., ['default', 'travel'])
  mediaType: MediaType;
  mediaUrl: string;
  carouselUrls?: string[];
  videoThumbnail?: string;
  aspectRatio: MediaAspect;
  caption: string;
  location?: string;
  tags: string[];
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isPinned?: boolean;
  createdAt: string;
  viewsCount?: number;
  comments: CommentItem[];
  // For 'thought' / micro-blog type posts:
  thoughtMood?: string;
  thoughtBackground?: string;
}

export interface GridPage {
  id: string;
  title: string;
  slug: string;
  icon: string; // 'grid' | 'film' | 'plane' | 'camera' | 'feather' | 'briefcase' | 'sparkles' | 'image' | 'book'
  layout: GridLayout;
  description?: string;
  isDeletable: boolean;
  order: number;
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  caption?: string;
  date: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  coverUrl: string;
  stories: StorySlide[];
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  websiteUrl: string;
  websiteLabel?: string;
  category: string;
  pronouns?: string;
  isVerified: boolean;
  postsCountOverride?: number;
  followersCount: string;
  followingCount: string;
}

export interface AppExportData {
  version: string;
  exportedAt: string;
  profile: UserProfile;
  grids: GridPage[];
  posts: PostItem[];
  highlights: HighlightItem[];
}
