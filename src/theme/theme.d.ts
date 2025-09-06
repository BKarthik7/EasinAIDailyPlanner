import 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      // Custom colors
      textPrimary: string;
      textSecondary: string;
      textDisabled: string;
      lightGray: string;
      gray: string;
      darkGray: string;
      border: string;
      shadow: string;
      overlay: string;
      // Add any other custom colors you've defined
    }
  }
}
