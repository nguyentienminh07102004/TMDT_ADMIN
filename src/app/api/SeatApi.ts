import { request } from "../lib/baseApi";
import { Seat } from "../types/Seat";

export const seatApi = {
  update(payload: Seat[]) {
    return request<Seat[]>(`/v1/seats`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  search(roomId: number) {
    return request<Seat[]>(`/v1/seats/${roomId}`, {
      method: "GET"
    });
  },
};