import api from "@/utils/api";

interface GraphQLResponse {
  data?: any;
  errors?: { message: string }[];
}

export async function graphqlRequest(
  query: string,
  variables = {},
  token?: string
): Promise<GraphQLResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await api.post(
      "/graphql",
      { query, variables },
      { headers }
    );

    return response.data;
  } catch (err: any) {
    console.error("GraphQL request failed:", err);
    throw new Error(err.message || "An unexpected error occurred.");
  }
}
