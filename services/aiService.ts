import { apiClient } from "./apiClient";

export interface AISuggestionRequest {
  period: string;
}

export interface AISuggestionResponse {
  success: boolean;
  data: {
    suggestions: string;
  };
}

export const aiService = {
  async getSuggestions(period: string): Promise<AISuggestionResponse> {
    return apiClient.post<AISuggestionResponse>("/ai/suggestions", { period });
  },
};
