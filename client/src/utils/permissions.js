import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

class PermissionManager {
  // Request location permissions
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionDeniedAlert('Location', 'location services');
        return false;
      }

      // For ambulance/volunteer roles, also request background
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      
      return true;
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestNotificationPermission() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionDeniedAlert('Notification', 'emergency alerts');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  // Request camera permissions
  async requestCameraPermission() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionDeniedAlert('Camera', 'take photos');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  // Request media library permissions
  async requestMediaLibraryPermission() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionDeniedAlert('Media Library', 'access photos');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Media library permission error:', error);
      return false;
    }
  }

  // Check if location permission is granted
  async hasLocationPermission() {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  }

  // Check if notification permission is granted
  async hasNotificationPermission() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  // Show permission denied alert
  showPermissionDeniedAlert(permissionName, purpose) {
    Alert.alert(
      `${permissionName} Permission Required`,
      `HealthLink needs ${permissionName.toLowerCase()} access to ${purpose}. Please enable it in Settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => this.openSettings() }
      ]
    );
  }

  // Open app settings
  openSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  // Request all critical permissions
  async requestAllCriticalPermissions() {
    const permissions = {
      location: await this.requestLocationPermission(),
      notification: await this.requestNotificationPermission()
    };

    return permissions;
  }

  // Check all critical permissions
  async checkAllCriticalPermissions() {
    const permissions = {
      location: await this.hasLocationPermission(),
      notification: await this.hasNotificationPermission()
    };

    return permissions;
  }
}

const permissionManager = new PermissionManager();
export default permissionManager;