import axios, { AxiosError, AxiosResponse } from "axios";

/** Mọi response của backend đều bọc dạng { status, data }. */
export interface ApiEnvelope<T = unknown> {
  status: "OK" | "FAILED";
  data: T;
  message?: unknown;
}

const isEnvelope = (body: any): body is ApiEnvelope =>
  body !== null &&
  typeof body === "object" &&
  !Array.isArray(body) &&
  (body.status === "OK" || body.status === "FAILED") &&
  "data" in body;

/**
 * Nội dung lỗi phẳng như trước khi có envelope, để code đọc
 * error.response.data.message (hay .jobId) vẫn chạy.
 */
function failureBody({ status, data, ...rest }: ApiEnvelope): any {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return { ...rest, ...data };
  }
  if (typeof data === "string" || Array.isArray(data)) {
    return { ...rest, message: rest.message ?? data };
  }
  return rest;
}

/**
 * Bóc envelope ở một chỗ: service vẫn đọc response.data là dữ liệu thật.
 * status "FAILED" (kể cả khi HTTP 200) bị reject như một lỗi axios.
 * Gọi trước setupAxiosAuth để interceptor 401/403 thấy nội dung đã bóc.
 */
export function setupApiEnvelope() {
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      const body = response.data;
      if (!isEnvelope(body)) return response;
      if (body.status === "OK") {
        response.data = body.data;
        return response;
      }
      response.data = failureBody(body);
      return Promise.reject(
        new AxiosError(
          "Request failed",
          AxiosError.ERR_BAD_RESPONSE,
          response.config,
          response.request,
          response
        )
      );
    },
    (error) => {
      const body = error?.response?.data;
      if (isEnvelope(body)) error.response.data = failureBody(body);
      return Promise.reject(error);
    }
  );
}
