import { apiService } from './api';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async register(userData) {
    try {
      const response = await apiService.register(userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  async logout() {
    try {
      await apiService.logout();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: true }; // Still consider it success for local cleanup
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.getCurrentUser();
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  }

  async changePassword(passwords) {
    try {
      const response = await apiService.changePassword(passwords);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password'
      };
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiService.forgotPassword(email);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await apiService.resetPassword(token, password);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
}

const authService = new AuthService();
export default authService;