import { MD3Theme, MD3Colors } from 'react-native-paper';

declare module 'react-native-paper' {
  namespace ReactNativePaper {
    interface MD3Colors {
      // Custom color variants
      primaryLight: string;
      primaryDark: string;
      secondaryLight: string;
      secondaryDark: string;
      
      // Status colors
      success: string;
      onSuccess: string;
      successContainer: string;
      onSuccessContainer: string;
      
      warning: string;
      onWarning: string;
      warningContainer: string;
      onWarningContainer: string;
      
      info: string;
      onInfo: string;
      infoContainer: string;
      onInfoContainer: string;
      
      // UI Colors
      border: string;
      gray: string;
      lightGray: string;
      darkGray: string;
      overlay: string;
      
      // Text colors (legacy support)
      textPrimary: string;
      textSecondary: string;
      textDisabled: string;
    }
  }
}

export {};
