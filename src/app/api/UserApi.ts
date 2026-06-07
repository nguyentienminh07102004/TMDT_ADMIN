import { request } from "../lib/baseApi";
import { Login, LoginResponse, UserRequest, UserResponse, UserSearch } from "../types/User";

export const userApi = {
  // CREATE
  createAdmin(payload: UserRequest) {
    return request<UserResponse>("/v1/users/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // SEARCH (PAGINATION - FIXED)
  search(params: UserSearch) {
    const query = new URLSearchParams();

    if (params?.page !== undefined) query.append("page", String(params.page));
    if (params?.size !== undefined) query.append("size", String(params.size));
    if (params?.keyword) query.append("keyword", params.keyword);
    if (params?.role) query.append("role", String(params.role));
    if (params?.isLock) query.append("isLock", String(params.isLock));

    return request<UserResponse[]>(
      `/v1/users?${query.toString()}`,
      {
        method: "GET",
      }
    );
  },

  login(payload: Login) {
    return request<LoginResponse>("/v1/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};