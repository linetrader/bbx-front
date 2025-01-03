// src/utils/graphqlApi.ts

// src/utils/graphqlApi.ts

import api from "@/utils/api";
import { useApiState } from "@/hooks/useApiState";
import { useAuth } from "@/context/AuthContext";

interface GraphQLError {
  message: string;
}

interface GraphQLResponse {
  data?: any;
  errors?: { message: string }[];
}

export function useGraphQL() {
  const { loading, setLoading, error, setError, resetError } = useApiState();
  const { token, logout, isTokenValid } = useAuth();

  const graphqlRequest = async (
    query: string,
    variables = {},
    skipAuthCheck: boolean = false
  ): Promise<GraphQLResponse> => {
    resetError();
    setLoading(true);

    // 토큰 유효성 확인
    if (!skipAuthCheck && (!token || !isTokenValid())) {
      setError("Authentication token is missing or invalid.");
      logout(); // 유효하지 않은 경우 로그아웃 처리
      setLoading(false);
      return Promise.reject(new Error("Session expired. Logged out."));
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // GraphQL 요청
      const response = await api.post(
        "/graphql",
        { query, variables },
        { headers }
      );

      const { data } = response;

      // data가 null인 경우를 처리
      if (!data) {
        const errorMessage = "No data received from GraphQL server.";
        setError(errorMessage);
        setLoading(false);
        return Promise.reject(errorMessage); // 에러 메시지만 반환
      }

      // GraphQL 에러 처리
      if (data.errors) {
        const serverMessage = data.errors
          .map((error: GraphQLError) => error.message)
          .join(", ");

        // 여기서 예외가 BadRequestException 혹은 UnauthorizedException인 경우
        setError(serverMessage); // 에러 메시지를 상태에 설정
        setLoading(false);
        return Promise.reject(serverMessage); // new Error 없이 메시지만 반환
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        //console.error("GraphQL request failed:", error.message);
        setError(error.message);
        return Promise.reject(new Error(error.message)); // 해당 오류를 반환
      }

      console.error("GraphQL request failed with unknown error:", error);
      const errorMessage = "An unexpected error occurred.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { graphqlRequest, loading, error, setError, resetError };
}
