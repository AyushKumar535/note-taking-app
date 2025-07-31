// API configuration and service functions
const API_BASE_URL = "http://localhost:5000";

// API response types
export interface ApiResponse<T = any> {
  status: "SUCCESS" | "ERROR";
  message: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: "email" | "google";
  isVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: "ERROR",
        message: "Network error. Please check your connection.",
      };
    }
  }

  // Auth endpoints
  async signup(
    name: string,
    email: string
  ): Promise<ApiResponse> {
    return this.apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.apiCall<AuthResponse>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(
    email: string
  ): Promise<ApiResponse> {
    return this.apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyLoginOTP(
    email: string,
    otp: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.apiCall<AuthResponse>("/auth/verify-login", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOTP(email: string): Promise<ApiResponse> {
    return this.apiCall("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<{ user: User }>> {
    return this.apiCall<{ user: User }>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Notes endpoints
  async getNotes(
    token: string
  ): Promise<ApiResponse<{ notes: any[]; count: number }>> {
    return this.apiCall<{ notes: any[]; count: number }>("/notes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createNote(
    token: string,
    title: string,
    content: string
  ): Promise<ApiResponse<{ note: any }>> {
    return this.apiCall<{ note: any }>("/notes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
  }

  async deleteNote(token: string, noteId: string): Promise<ApiResponse> {
    return this.apiCall(`/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
