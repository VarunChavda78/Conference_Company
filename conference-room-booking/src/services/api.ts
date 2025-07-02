const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    isOwner: boolean;
  };
}

export interface ApiError {
  message: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Bookings
  async getBookings(date?: string): Promise<any[]> {
    const url = date ? `${API_BASE_URL}/bookings?date=${date}` : `${API_BASE_URL}/bookings`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<any[]>(response);
  }

  async getBookingsByDate(date: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/bookings/date/${date}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<any[]>(response);
  }

  async createBooking(bookingData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    return this.handleResponse<any>(response);
  }

  async updateBooking(id: string, bookingData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    return this.handleResponse<any>(response);
  }

  async deleteBooking(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<{ status: string; message: string }>(response);
  }
}

export const apiService = new ApiService(); 