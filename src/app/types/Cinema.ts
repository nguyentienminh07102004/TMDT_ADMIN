export interface CinemaResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CinemaRequest {
  name: string;
  address: string;
  city: string;
}

export interface CinemaSearch {
  page: number;
  size: number;
  keyword: string;
  status: string;
}