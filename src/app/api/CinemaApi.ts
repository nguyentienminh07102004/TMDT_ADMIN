import { BaseResponse, request } from "../lib/baseApi";
import { CinemaResponse, CinemaRequest, CinemaSearch } from "../types/Cinema";

export const cinemaApi = {
  search() {
    return request<CinemaResponse[]>("/v1/cinemas", {
      method: "GET",
    });
  },

  getById(id: number) {
    return request<CinemaResponse>(`/v1/cinemas/${id}`);
  },

  create(payload: CinemaRequest) {
    return request<CinemaResponse>("/v1/cinemas", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: CinemaRequest) {
    return request<CinemaResponse>(`/v1/cinemas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete(id: number) {
    return request<BaseResponse<void>>(`/v1/cinemas/${id}`, {
      method: "DELETE",
    });
  },
};