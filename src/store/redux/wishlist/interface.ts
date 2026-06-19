export interface WishlistCourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  slug: string;
  thumbnail: string;
  previewVideoUrl?: string;
  instructor: string;
  currency: string;
  rating?: number;
  reviewCount?: number;
  totalDuration?: number;
}

export interface WishlistReduxState {
  courses: WishlistCourse[];
  isLoading: boolean;
  error: null | string;
  isFetched: boolean;
}
