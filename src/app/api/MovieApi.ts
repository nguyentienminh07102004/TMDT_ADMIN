import { request, BaseResponse } from "../lib/baseApi";
import { MovieRequest, MovieResponse, MovieSearch, MovieIdsRequest } from "../types/Movie";

export const movieApi = {
  // CREATE
  create(payload: MovieRequest) {
    return request<MovieResponse>("/v1/movies", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // UPDATE
  update(id: number, payload: MovieRequest) {
    return request<MovieResponse>(`/v1/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE BULK
  delete(id: number) {
    return request<void>(`/v1/movies/${id}`, {
      method: "DELETE",
    });
  },

  // GET ONE
  getOne(id: number) {
    return request<MovieResponse>(`/v1/movies/${id}`, {
      method: "GET",
    });
  },

  // SEARCH (PAGINATION - FIXED)
  search(params: MovieSearch) {
    const query = new URLSearchParams();

    if (params?.page !== undefined) query.append("page", String(params.page));
    if (params?.size !== undefined) query.append("size", String(params.size));
    if (params?.keyword) query.append("keyword", params.keyword);
    if (params?.status) query.append("status", String(params.status));

    return request<MovieResponse[]>(
      `/v1/movies?${query.toString()}`,
      {
        method: "GET",
      }
    );
  },

  getTrending() {
    return request<MovieResponse[]>(`/v1/movies/trending`, {
      method: "GET",
    });
  },

  reorder(movieIdsRequest:MovieIdsRequest) {
    return request<MovieIdsRequest>(`/v1/movies/reorder`, {
      method: "PUT",
      body: JSON.stringify(movieIdsRequest),
    });
  },

  removeTrending(movieIdsRequest:MovieIdsRequest) {
    return request<MovieIdsRequest>(`/v1/movies/remove-trending`, {
      method: "PUT",
      body: JSON.stringify(movieIdsRequest),
    });
  },
};