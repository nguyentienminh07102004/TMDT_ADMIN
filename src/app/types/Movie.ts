export interface MovieRequest {
  title: string;
  genre: string;
  duration: number;
  director: string;
  movieCast: string;
  description: string;
  posterId: string | null;
  releaseDate: string;
  teaserId: string | null;
  isTrending: boolean;
}

export interface MovieIdsRequest {
  movieIds: number[];
}

export type MovieStatus = "COMING_SOON" | "NOW_SHOWING" | "ENDED";

export interface MovieResponse {
  id: number;
  title: string;
  genre: string;
  duration: number;
  director: string;
  movieCast: string;
  description: string;
  posterUrl: string;
  releaseDate: string;
  status: MovieStatus;
  teaserUrl: string;
  isTrending: boolean;

  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MovieSearch {
  page: number;
  size: number;
  keyword: string ;
  status: MovieStatus | null;
}