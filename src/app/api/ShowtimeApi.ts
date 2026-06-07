import { request } from "../lib/baseApi";
import { ShowtimeRequest, ShowtimeResponse, ShowtimeSearch } from "../types/Showtime";

export const showtimeApi = {
  create(payload: ShowtimeRequest) {
    return request<ShowtimeResponse>(`/v1/showtimes`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  search(showtimeSearch: ShowtimeSearch) {
    return request<ShowtimeResponse[]>(`/v1/showtimes`, {
      method: "GET",
      params: showtimeSearch,
    });
  },
};