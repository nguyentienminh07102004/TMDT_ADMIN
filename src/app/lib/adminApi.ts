const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
  metaData?: unknown;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken") ?? localStorage.getItem("token");

  const response = await fetch(`${DEFAULT_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiWrapper<T> | T;

  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as ApiWrapper<T>).message)
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  if (typeof payload === "object" && payload !== null && "success" in payload && "data" in payload) {
    return (payload as ApiWrapper<T>).data;
  }

  return payload as T;
}

export type UserRole = "USER" | "ADMIN";
export type MovieStatus = "COMING_SOON" | "NOW_SHOWING" | "ENDED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface UserResponse {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  isLock?: boolean;
}

export interface CreateUserPayload {
  email: string;
  phone: string;
  fullName: string;
  password: string;
  role: UserRole;
}

export interface MovieResponse {
  id: number;
  title: string;
  genre: string;
  duration: number;
  director: string;
  cast: string;
  description: string;
  posterMediaId: string | null;
  releaseDate: string;
  status: MovieStatus;
  teaserUrl: string | null;
  reviewUrl: string | null;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CreateMoviePayload {
  title: string;
  genre: string;
  duration: number;
  director: string;
  cast: string;
  description: string;
  posterMediaId: string | null;
  releaseDate: string;
  status: MovieStatus;
  teaserUrl: string | null;
  reviewUrl: string | null;
}

export interface BookingResponse {
  id: number;
  userId: string;
  showtimeId: number;
  promotionId: number | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: BookingStatus;
  qrCode: string;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CreateBookingPayload {
  userId: string;
  showtimeId: number;
  promotionId: number | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: BookingStatus;
  qrCode: string;
}

export interface BookingDetailResponse {
  id: number;
  bookingId: number;
  seatId: number;
  priceAtTime: number;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CreateBookingDetailPayload {
  bookingId: number;
  seatId: number;
  priceAtTime: number;
}

export const adminApi = {
  createUser(payload: CreateUserPayload) {
    return request<UserResponse>("/v1/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  createMovie(payload: CreateMoviePayload) {
    return request<MovieResponse>("/v1/movies", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  createBooking(payload: CreateBookingPayload) {
    return request<BookingResponse>("/v1/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  createBookingDetail(payload: CreateBookingDetailPayload) {
    return request<BookingDetailResponse>("/v1/booking-details", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};