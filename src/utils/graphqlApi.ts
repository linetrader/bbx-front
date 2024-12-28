// src/utils/graphqlApi.ts

import api from "@/utils/api";
import { useApiState } from "@/hooks/useApiState";
import { useAuth } from "@/context/AuthContext";

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
    skipAuthCheck: boolean = false // 추가된 플래그로 인증 확인 건너뛰기 옵션 제공
  ): Promise<GraphQLResponse> => {
    resetError();
    setLoading(true);

    //console.log("graphqlRequest - ", query);

    // 토큰 유효성 확인
    if (!skipAuthCheck && (!token || !isTokenValid())) {
      console.log(skipAuthCheck);
      console.log(token);
      console.log(isTokenValid());
      setError("Authentication token is missing or invalid.");
      logout(); // 유효하지 않으면 로그아웃 처리
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

      //console.log("headers : ", headers);

      const response = await api.post(
        "/graphql",
        { query, variables },
        { headers }
      );

      const { data } = response;

      // GraphQL 에러 체크
      if (data.errors) {
        //console.error("GraphQL Errors:", data.errors);
        const serverMessage = data.errors
          .map((error: { message: string }) => error.message)
          .join(", ");

        setError(serverMessage);
        setLoading(false);

        return Promise.reject(new Error(serverMessage));
      }
      //console.log("graphqlRequest - response.data", response.data);

      return response.data;
    } catch (err: any) {
      console.error("GraphQL request failed:", err);
      setError(err.message || "An unexpected error occurred.");
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { graphqlRequest, loading, error, setError, resetError };
}
