import { clearAuthSession, getValidAccessToken } from "./auth";

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8889/api";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
  metaData?: unknown;
};

export type PageResponse<T> = {
  content: T[];
  pageable?: unknown;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getValidAccessToken();

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
    if (response.status === 401 || response.status === 403) {
      clearAuthSession();
    }

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  fullName: string;
  avatar: string | null;
}

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

export interface RoomResponse {
  id: number;
  name: string;
  totalSeats: number;
  cinemaId: number;
  type: string;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
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

export interface ShowtimeResponse {
  id: number;
  startTime: string;
  endTime: string;
  movieId: number;
  roomId: number;
  basePrice: number;
  availableSeats: number;
  status: string;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

function buildQuery(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const adminApi = {
  login(payload: LoginRequest) {
    return request<LoginResponse>("/v1/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  listUsers(params?: { page?: number; size?: number }) {
    return request<PageResponse<UserResponse>>(`/v1/users${buildQuery(params)}`);
  },

  listMovies(params?: { page?: number; size?: number }) {
    return request<PageResponse<MovieResponse>>(`/v1/movies${buildQuery(params)}`);
  },

  listBookings(params?: { page?: number; size?: number }) {
    return request<PageResponse<BookingResponse>>(`/v1/bookings${buildQuery(params)}`);
  },

  listBookingDetails(params?: { page?: number; size?: number }) {
    return request<PageResponse<BookingDetailResponse>>(`/v1/booking-details${buildQuery(params)}`);
  },

  listShowtimes(params?: { page?: number; size?: number }) {
    return request<PageResponse<ShowtimeResponse>>(`/v1/showtimes${buildQuery(params)}`);
  },

  listRooms(params?: { page?: number; size?: number }) {
    return request<PageResponse<RoomResponse>>(`/v1/rooms${buildQuery(params)}`);
  },

  listCinemas(params?: { page?: number; size?: number }) {
    return request<PageResponse<CinemaResponse>>(`/v1/cinemas${buildQuery(params)}`);
  },

  createUser(payload: CreateUserPayload) {
    return request<UserResponse>("/v1/users/register", {
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