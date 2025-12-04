import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import socketService from '../services/socketService';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  
  if (data) {
    const { locations } = data;
    const location = locations[0];
    
    if (location) {
      // Send location update via socket
      socketService.updateLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        timestamp: location.timestamp
      });
    }
  }
});

export default function useBackgroundLocation() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackgroundTracking();
  }, []);

  const checkBackgroundTracking = async () => {
    const hasTask = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    setIsTracking(hasTask);
  };

  const startBackgroundTracking = async () => {
    try {
      setError(null);

      // Request background permission
      const { status } = await Location.requestBackgroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Background location permission denied');
        return false;
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Or every 10 meters
        foregroundService: {
          notificationTitle: 'HealthLink Tracking',
          notificationBody: 'Location tracking active for emergency response',
          notificationColor: '#DC2626'
        }
      });

      setIsTracking(true);
      console.log('Background tracking started');
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Start background tracking error:', err);
      return false;
    }
  };

  const stopBackgroundTracking = async () => {
    try {
      const hasTask = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      
      if (hasTask) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
        console.log('Background tracking stopped');
      }
    } catch (err) {
      console.error('Stop background tracking error:', err);
    }
  };

  return {
    isTracking,
    error,
    startBackgroundTracking,
    stopBackgroundTracking
  };
}