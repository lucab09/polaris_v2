import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { useUserStore } from '@store/userStore';
import { SCREENS, COLORS } from '@utils/constants';

// Screens
import OnboardingScreen from '@screens/OnboardingScreen';
import HomeScreen from '@screens/HomeScreen';
import ConsentsScreen from '@screens/ConsentsScreen';
import SettingsScreen from '@screens/SettingsScreen';
import DataDashboardScreen from '@screens/DataDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen: React.FC = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
  </View>
);

const HomeStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.GRAY_200,
        borderBottomWidth: 1,
      },
      headerTintColor: COLORS.PRIMARY,
      headerTitleStyle: {
        fontWeight: '600',
      },
      cardStyle: {
        backgroundColor: COLORS.GRAY_50,
      },
    }}
  >
    <Stack.Screen
      name={SCREENS.HOME}
      component={HomeScreen}
      options={{
        headerTitle: 'Polaris',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const ConsentsStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.GRAY_200,
        borderBottomWidth: 1,
      },
      headerTintColor: COLORS.PRIMARY,
      headerTitleStyle: {
        fontWeight: '600',
      },
      cardStyle: {
        backgroundColor: COLORS.GRAY_50,
      },
    }}
  >
    <Stack.Screen
      name={SCREENS.CONSENTS}
      component={ConsentsScreen}
      options={{
        headerTitle: 'Privacy Consent',
      }}
    />
  </Stack.Navigator>
);

const DataStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.GRAY_200,
        borderBottomWidth: 1,
      },
      headerTintColor: COLORS.PRIMARY,
      headerTitleStyle: {
        fontWeight: '600',
      },
      cardStyle: {
        backgroundColor: COLORS.GRAY_50,
      },
    }}
  >
    <Stack.Screen
      name={SCREENS.DATA_DASHBOARD}
      component={DataDashboardScreen}
      options={{
        headerTitle: 'My Data',
      }}
    />
  </Stack.Navigator>
);

const SettingsStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.GRAY_200,
        borderBottomWidth: 1,
      },
      headerTintColor: COLORS.PRIMARY,
      headerTitleStyle: {
        fontWeight: '600',
      },
      cardStyle: {
        backgroundColor: COLORS.GRAY_50,
      },
    }}
  >
    <Stack.Screen
      name={SCREENS.SETTINGS}
      component={SettingsScreen}
      options={{
        headerTitle: 'Settings',
      }}
    />
  </Stack.Navigator>
);

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.WHITE,
        borderTopColor: COLORS.GRAY_200,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: COLORS.PRIMARY,
      tabBarInactiveTintColor: COLORS.GRAY_400,
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
    <Tab.Screen
      name="DataTab"
      component={DataStackNavigator}
      options={{
        tabBarLabel: 'My Data',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
    <Tab.Screen
      name="ConsentsTab"
      component={ConsentsStackNavigator}
      options={{
        tabBarLabel: 'Privacy',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
    <Tab.Screen
      name="SettingsTab"
      component={SettingsStackNavigator}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const RootNavigator: React.FC = () => {
  const { user, isLoading, isOnboarded } = useUserStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name={SCREENS.ONBOARDING} component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
