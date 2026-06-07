import { request } from "./baseApi";

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

export type UserResponse = {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
};

export type MovieResponse = {
  id: number;
  title: string;
  posterMediaId?: string | null;
  status?: string;
};

export type BookingResponse = {
  id: number;
  userId: string;
  showtimeId: number;
  totalAmount: number;
  status: string;
};

export type BookingDetailResponse = {
  id: number;
  bookingId: number;
  seatId: number;
  priceAtTime: number;
};

export type ShowtimeResponse = {
  id: number;
  startTime: string;
  endTime: string;
  movieId: number;
  roomId: number;
};

export type RoomResponse = {
  id: number;
  name: string;
  cinemaId: number;
  totalSeats?: number;
};

export type CinemaResponse = {
  id: number;
  name: string;
  address?: string;
};

export const adminApi = {
  async listUsers(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<UserResponse>>("/v1/users", { method: "GET", params });
    return res.data;
  },

  async listMovies(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<MovieResponse>>("/v1/movies", { method: "GET", params });
    return res.data;
  },

  async listBookings(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<BookingResponse>>("/v1/bookings", { method: "GET", params });
    return res.data;
  },

  async listBookingDetails(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<BookingDetailResponse>>("/v1/booking-details", { method: "GET", params });
    return res.data;
  },

  async listShowtimes(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<ShowtimeResponse>>("/v1/showtimes", { method: "GET", params });
    return res.data;
  },

  async listRooms(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<RoomResponse>>("/v1/rooms", { method: "GET", params });
    return res.data;
  },

  async listCinemas(params: { page?: number; size?: number } = {}) {
    const res = await request<PageResponse<CinemaResponse>>("/v1/cinemas", { method: "GET", params });
    return res.data;
  },
};

export default adminApi;
