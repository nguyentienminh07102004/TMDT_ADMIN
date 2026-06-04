export type SeatType = "STANDARD" | "VIP" | "COUPLE" | "UNAVAILABLE";

export interface Seat {
  row: string;
  seatNumber: number;
  rowNumber: SeatType;
  roomId: number;
  type: SeatType;
  priceMultiplier: number;
}