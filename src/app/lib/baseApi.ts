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

  // 1. Query params
  if (options?.params) {
    const query = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });

    const qs = query.toString();
    if (qs) finalUrl += `?${qs}`;
  }

  // 2. Headers
  const headers = new Headers(options?.headers);

  // 3. Token: only attach Authorization header when token exists.
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 4. Content-Type
  const isFormData = options?.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (isFormData) {
    headers.delete("Content-Type");
  }

  // 5. Fetch
  const response = await fetch(finalUrl, {
    ...options,
    headers,
  });

  const result: BaseResponse<T> = await response.json();

  // 6. Handle error
  if (!response.ok || !result.success) {
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth_session");
      window.location.href = "/login";
    }

    throw new Error(result.message || `Lỗi hệ thống (${response.status})`);
  }

  return result;
}