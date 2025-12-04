import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import socketService from '../services/socketService';
import { STORAGE_KEYS } from '../utils/constants';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiService.login(credentials);
      const { user, token, refreshToken } = response.data;

      // Save to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)]
      ]);

      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      });

      // Connect socket
      await socketService.connect();

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiService.register(userData);
      const { user, token, refreshToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)]
      ]);

      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      });

      await socketService.connect();

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.log('Logout API error:', error);
    } finally {
      // Clear storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA
      ]);

      // Disconnect socket
      socketService.disconnect();

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });

      const [[, token], [, refreshToken], [, userData]] = await AsyncStorage.multiGet([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false
        });

        // Reconnect socket
        await socketService.connect();

        // Refresh user data
        try {
          const response = await apiService.getCurrentUser();
          set({ user: response.data.user });
        } catch (error) {
          console.log('Failed to refresh user data:', error);
        }

        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Load stored auth error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  },

  setError: (error) => set({ error }),

  clearError: () => set({ error: null })
}));

export default useAuthStore;