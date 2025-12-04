import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/User/DashboardScreen';
import EmergencySOSScreen from '../screens/User/EmergencySOSScreen';
import TrackAmbulanceScreen from '../screens/User/TrackAmbulanceScreen';
import ProfileScreen from '../screens/User/ProfileScreen';
import { SCREENS, COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name={SCREENS.EMERGENCY_SOS} component={EmergencySOSScreen} />
    <Stack.Screen name={SCREENS.TRACK_AMBULANCE} component={TrackAmbulanceScreen} />
  </Stack.Navigator>
);

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Emergency') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Track') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen 
        name="Emergency" 
        component={EmergencySOSScreen}
        options={{
          tabBarLabel: 'SOS',
          tabBarLabelStyle: { fontWeight: 'bold' }
        }}
      />
      <Tab.Screen name="Track" component={TrackAmbulanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default UserNavigator;