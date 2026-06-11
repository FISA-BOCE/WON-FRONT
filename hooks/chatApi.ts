import { ApiResponse, apiClient } from '@/hooks/apiClient';

export interface ChatResponse {
  answer: string;
}

interface ChatRequest {
  message: string;
}

export async function createChat(message: string) {
  const response = await apiClient.post<
    ApiResponse<ChatResponse>,
    { data: ApiResponse<ChatResponse> },
    ChatRequest
  >('/api/chats', { message });

  return response.data.data;
}
