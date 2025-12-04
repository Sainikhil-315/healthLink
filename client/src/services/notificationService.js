import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX
  })
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.expoPushToken = null;
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for push notifications');
        return { granted: false, token: null };
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return { granted: false, token: null };
      }

      // Get push token
      const token = await this.getExpoPushToken();

      return { granted: true, token };
    } catch (error) {
      console.error('Notification permission error:', error);
      return { granted: false, token: null };
    }
  }

  // Get Expo push token
  async getExpoPushToken() {
    try {
      if (this.expoPushToken) {
        return this.expoPushToken;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;

      // Store token
      await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);

      console.log('Expo Push Token:', token);
      return token;
    } catch (error) {
      console.error('Get push token error:', error);
      return null;
    }
  }

  // Setup notification channels (Android)
  async setupNotificationChannels() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('emergency', {
        name: 'Emergency Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'emergency-alert.wav',
        lightColor: '#DC2626',
        enableVibrate: true,
        enableLights: true,
        showBadge: true
      });

      await Notifications.setNotificationChannelAsync('updates', {
        name: 'Status Updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#3B82F6'
      });

      await Notifications.setNotificationChannelAsync('requests', {
        name: 'Service Requests',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#F59E0B'
      });
    }
  }

  // Show local notification
  async showNotification(title, body, data = {}, channelId = 'updates') {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: channelId === 'emergency' ? 'emergency-alert.wav' : 'default',
          priority: channelId === 'emergency' 
            ? Notifications.AndroidNotificationPriority.MAX 
            : Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          badge: 1
        },
        trigger: null, // Show immediately
        ...(Platform.OS === 'android' && { channelId })
      });
    } catch (error) {
      console.error('Show notification error:', error);
    }
  }

  // Show emergency alert
  async showEmergencyAlert(incident) {
    await this.showNotification(
      '🚨 Emergency Alert',
      `Emergency ${incident.severity} at ${incident.location.address}`,
      { type: 'emergency', incidentId: incident.id },
      'emergency'
    );
  }

  // Show ambulance request
  async showAmbulanceRequest(incident) {
    await this.showNotification(
      '🚑 Emergency Request',
      `Patient needs assistance. Tap to respond.`,
      { type: 'ambulance_request', incidentId: incident.id },
      'requests'
    );
  }

  // Show volunteer request
  async showVolunteerRequest(incident, distance) {
    await this.showNotification(
      '🆘 CPR Needed - Critical',
      `Patient ${distance}m away needs immediate help!`,
      { type: 'volunteer_request', incidentId: incident.id },
      'emergency'
    );
  }

  // Show blood donor request
  async showBloodDonorRequest(bloodType, hospital) {
    await this.showNotification(
      `🩸 ${bloodType} Blood Needed`,
      `Urgent request at ${hospital.name}`,
      { type: 'blood_request', hospitalId: hospital.id },
      'requests'
    );
  }

  // Show status update
  async showStatusUpdate(title, message, data = {}) {
    await this.showNotification(
      title,
      message,
      { type: 'status_update', ...data },
      'updates'
    );
  }

  // Setup listeners
  setupListeners(onNotificationReceived, onNotificationTapped) {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification tapped:', response);
        if (onNotificationTapped) {
          onNotificationTapped(response);
        }
      }
    );
  }

  // Remove listeners
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }
  }

  // Clear all notifications
  async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }

  // Set badge count
  async setBadgeCount(count) {
    await Notifications.setBadgeCountAsync(count);
  }

  // Get badge count
  async getBadgeCount() {
    return await Notifications.getBadgeCountAsync();
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;