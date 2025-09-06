import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, configureFonts, useTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import OnboardingScreen from '@/screens/OnboardingScreen';
import DailyPlanScreen from '@/screens/DailyPlanScreen';
import TodoScreen from '@/screens/TodoScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { colors } from '@/theme/colors';

// TypeScript types for navigation
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: { screen: keyof TabParamList } | undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  'Daily Plan': undefined;
  'To Do': undefined;
  'Profile': undefined;
};

export type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure theme with custom fonts
const fontConfig = configureFonts({
  config: {
    // Use the default font configuration as base
    ...MD3LightTheme.fonts,
    // Customize specific font variants if needed
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: 'System',
    },
    // Add other font variants as needed
  },
});

// Extend the MD3 theme with our custom colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: colors.primary,
    primaryContainer: colors.primaryContainer,
    onPrimary: colors.onPrimary,
    onPrimaryContainer: colors.onPrimaryContainer,
    // Additional primary variants
    primaryLight: colors.primaryLight,
    primaryDark: colors.primaryDark,
    
    // Secondary colors
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondary: colors.onSecondary,
    onSecondaryContainer: colors.onSecondaryContainer,
    // Additional secondary variants
    secondaryLight: colors.secondaryLight,
    secondaryDark: colors.secondaryDark,
    
    // Background & Surface
    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.onSurfaceVariant,
    onSurfaceDisabled: colors.onSurfaceDisabled,
    
    // Status colors
    error: colors.error,
    onError: colors.onError,
    errorContainer: colors.errorContainer,
    onErrorContainer: colors.onErrorContainer,
    
    // Custom status colors (not part of MD3 spec but used in the app)
    success: colors.success,
    onSuccess: colors.onSuccess,
    successContainer: colors.successContainer,
    onSuccessContainer: colors.onSuccessContainer,
    
    warning: colors.warning,
    onWarning: colors.onWarning,
    warningContainer: colors.warningContainer,
    onWarningContainer: colors.onWarningContainer,
    
    info: colors.info,
    onInfo: colors.onInfo,
    infoContainer: colors.infoContainer,
    onInfoContainer: colors.onInfoContainer,
    
    // UI Colors
    outline: colors.outline,
    outlineVariant: colors.darkGray, // Using darkGray for outlineVariant
    shadow: colors.shadow,
    scrim: colors.overlay, // Using overlay for scrim
    inverseSurface: colors.inverseSurface,
    inverseOnSurface: colors.inverseOnSurface,
    inversePrimary: colors.inversePrimary,
    
    // Elevation
    elevation: colors.elevation,
    
    // UI Colors (custom)
    border: colors.border,
    gray: colors.gray,
    lightGray: colors.lightGray,
    darkGray: colors.darkGray,
    overlay: colors.overlay,
    
    // Text colors (custom)
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textDisabled: colors.textDisabled,
  },
  fonts: fontConfig,
};

function MainTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === 'Daily Plan') {
            iconName = focused ? 'calendar-today' : 'calendar-month';
          } else if (route.name === 'To Do') {
            iconName = focused ? 'format-list-checks' : 'format-list-bulleted';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
          paddingTop: 5,
          height:  50 + insets.bottom, // Add bottom inset to the height
          paddingBottom: insets.bottom, // Add bottom inset to the padding
          backgroundColor: theme.colors.surface,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Daily Plan" component={DailyPlanScreen} />
      <Tab.Screen name="To Do" component={TodoScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(true);

  // Check if it's the first launch
  React.useEffect(() => {
    // TODO: Implement check for first launch using AsyncStorage
    // For now, we'll set it to true to show onboarding
    setIsFirstLaunch(true);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator>
              {isFirstLaunch ? (
                <Stack.Screen 
                  name="Onboarding" 
                  component={OnboardingScreen} 
                  options={{ headerShown: false }}
                />
              ) : null}
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabs} 
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
