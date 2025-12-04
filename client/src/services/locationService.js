import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import socketService from './socketService';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchSubscription = null;
    this.isTracking = false;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_PERMISSION);
      
      if (stored === 'granted') {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          return { granted: true };
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return { 
          granted: false, 
          error: 'Location permission denied' 
        };
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_PERMISSION, 'granted');

      return { 
        granted: true, 
        background: backgroundStatus === 'granted' 
      };
    } catch (error) {
      console.error('Permission request error:', error);
      return { granted: false, error: error.message };
    }
  }

  // Get current location once
  async getCurrentLocation() {
    try {
      const { granted } = await this.requestPermissions();
      
      if (!granted) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      this.currentLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Get current location error:', error);
      throw error;
    }
  }

  // Start watching location
  async startTracking(callback) {
    try {
      if (this.isTracking) {
        return;
      }

      const { granted } = await this.requestPermissions();
      
      if (!granted) {
        throw new Error('Location permission not granted');
      }

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10
        },
        (location) => {
          const position = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp
          };

          this.currentLocation = position;
          socketService.updateLocation(position);

          if (callback) {
            callback(position);
          }
        }
      );

      this.isTracking = true;
      console.log('Location tracking started');
    } catch (error) {
      console.error('Start tracking error:', error);
      throw error;
    }
  }

  // Stop watching location
  stopTracking() {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
      this.isTracking = false;
      console.log('Location tracking stopped');
    }
  }

  // Get address from coordinates
  async getAddressFromCoords(lat, lng) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng
      });

      if (result && result.length > 0) {
        const address = result[0];
        return {
          street: address.street || '',
          city: address.city || '',
          region: address.region || '',
          country: address.country || '',
          postalCode: address.postalCode || '',
          formattedAddress: `${address.street || ''}, ${address.city || ''}, ${address.region || ''}`
        };
      }

      return null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  }

  // Calculate distance
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  formatDistance(km) {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  }

  calculateETA(distanceKm, speedKmh = 40) {
    const hours = distanceKm / speedKmh;
    const minutes = Math.ceil(hours * 60);
    return minutes;
  }

  formatETA(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  getCurrentLocationData() {
    return this.currentLocation;
  }

  isCurrentlyTracking() {
    return this.isTracking;
  }
}

const locationService = new LocationService();
export default locationService;e