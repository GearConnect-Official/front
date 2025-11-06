import { GroupUser } from "./group";

export interface PostMedia {
  id: number;
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId: string;
  width: number;
  height: number;
  duration?: number;
}

export interface PostComment {
  id: number;
  content: string;
  user: GroupUser;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    replies: number;
  };
}

export interface Post {
  id: number;
  content: string;
  user: GroupUser;
  media?: PostMedia[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isSaved: boolean;
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

// Default export to prevent Expo Router warnings
export { default } from '../NoRoute';