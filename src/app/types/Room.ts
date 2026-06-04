export interface RoomRequest {
  name: string;
  cinemaId: number;
  type: "STANDARD" | "IMAX" | "VIP";
  totalRow: number;
  totalSeatOfRow: number;
}

export interface RoomResponse {
  id: number;
  name: string;
  totalRow: number;
  cinemaId: number;
  cinemaName: string;
  type: "STANDARD" | "IMAX" | "VIP";
  totalSeatOfRow: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface RoomSearch {
  page: number;
  size: number;
  cinemaId: number | null;
}