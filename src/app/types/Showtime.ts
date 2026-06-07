export type ShowtimeStatus =
  | "COMING_SOON"
  | "UPCOMING"
  | "ENDED"
  | "CANCELLED";

export interface ShowtimeRequest {
  startTime: string; // LocalDateTime
  movieId: number;
  roomId: number;
  basePrice: number;
  status?: ShowtimeStatus;
}

export interface ShowtimeSearch {
  page: number;
  size: number;

  cinemaId?: number | null;

  movieName?: string;

  date?: string | null; // LocalDate (yyyy-MM-dd)

  status?: ShowtimeStatus | null;
}

export interface ShowtimeResponse {
  id: number;
  startTime: string; // LocalDateTime

  movieName: string;
  roomName: string;

  basePrice: number;

  totalSeats: number;
  availableSeats: number;

  status: ShowtimeStatus;

  createdAt: string; // Instant
  createdBy: string; // UUID

  updatedAt: string; // Instant
  updatedBy: string; // UUID
}