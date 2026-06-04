import { request } from "../lib/baseApi";
import { RoomRequest, RoomResponse, RoomSearch } from "../types/Room";

export const roomApi = {
  create(payload: RoomRequest) {
    return request<RoomResponse>("/v1/rooms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: RoomRequest) {
    return request<RoomResponse>(`/v1/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete(id: number) {
    return request<void>(`/v1/rooms/${id}`, {
      method: "DELETE",
    });
  },

  getOne(id: number) {
    return request<RoomResponse>(`/v1/rooms/${id}`);
  },

  search(roomSearch: RoomSearch) {
    return request<RoomResponse[]>("/v1/rooms", {
      method: "GET",
      params: roomSearch,
    });
  },
};