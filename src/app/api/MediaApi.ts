import { request } from "../lib/baseApi";
import { Media } from "../types/Media";


export const mediaApi = {
  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    // Để trình duyệt tự động xử lý Content-Type và sinh boundary thích hợp
    return request<Media>(`/v1/medias`, {
      method: "POST",
      body: formData,
    });
  },

  // DELETE MULTIPLE MEDIA
  delete(ids: string[]) {
    return request<void>(`/v1/medias`, {
      method: "DELETE",
      body: JSON.stringify(ids),
    });
  },
};