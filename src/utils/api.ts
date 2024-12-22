// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // NestJS 서버 주소
});

// 요청에 Authorization 헤더 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // error 객체의 response를 안전하게 확인
    const errorResponse = error?.response || null;
    const errorMessage =
      errorResponse?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    console.error("API Error:", {
      message: errorMessage,
      status: errorResponse?.status || "Unknown",
      data: errorResponse?.data || null,
      isNetworkError: !errorResponse,
    });

    return Promise.reject({
      message: errorMessage,
      status: errorResponse?.status || null,
      data: errorResponse?.data || null,
    });
  }
);

export default api;
