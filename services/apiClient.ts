const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api";

export const apiClient = {
  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    };

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url,
        method: config.method,
        body: options?.body
      });
    }

    try {
      const response = await fetch(url, config);

      // Handle auth session check gracefully
      if (response.status === 401) {
        // For /auth/me, 401 means "not logged in", NOT an error
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "An error occurred",
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Check if it's a network/CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network/CORS Error: Unable to reach API. Check CORS configuration.');
        throw new Error('Unable to connect to server. Please check your network connection.');
      }
      throw error;
    }
  },

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
