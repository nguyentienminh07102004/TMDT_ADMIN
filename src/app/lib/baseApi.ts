export interface BaseResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  metaData?: {
    totalPage: number;
    currentPage: number;
    pageSize: number;
  };
}

export async function request<T>(
  url: string,
  options?: RequestInit & { params?: Record<string, any> }
): Promise<BaseResponse<T>> {
  const baseUrl = "http://localhost:8889/api";

  let finalUrl = `${baseUrl}${url}`;

  if (options?.params) {
    const query = new URLSearchParams();

    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    finalUrl += `?${query.toString()}`;
  }

  // --- ĐOẠN XỬ LÝ HEADERS ĐÃ ĐƯỢC FIX LỖI TYPESCRIPT ---
  const isFormData = options?.body instanceof FormData;
  
  // Sử dụng class Headers để bọc lại options?.headers, xử lý được mọi kiểu dữ liệu đầu vào
  const headers = new Headers(options?.headers);

  // Chỉ thêm Content-Type JSON nếu body KHÔNG PHẢI là FormData
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  // Nếu là FormData, bắt buộc xóa Content-Type để trình duyệt tự điền boundary mượt mà
  if (isFormData) {
    headers.delete("Content-Type");
  }
  // ----------------------------------------------------

  const response = await fetch(finalUrl, {
    headers, // Truyền trực tiếp instance Headers vào fetch
    method: options?.method,
    body: options?.body,
  });

  const result: BaseResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Đã có lỗi xảy ra");
  }

  return result;
}