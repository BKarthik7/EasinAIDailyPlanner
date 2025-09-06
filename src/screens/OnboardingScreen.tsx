import React from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { OnboardingNavigationProp } from '../../App';

const { width, height } = Dimensions.get('window');

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Plan Your Day',
    description: 'Organize your tasks and schedule your day for maximum productivity.',
    icon: 'calendar-check',
  },
  {
    id: '2',
    title: 'Track Progress',
    description: 'Monitor your progress and stay on top of your goals with insightful analytics.',
    icon: 'chart-line',
  },
  {
    id: '3',
    title: 'Focus on What Matters',
    description: 'Prioritize important tasks and focus on what truly matters to you.',
    icon: 'target',
  },
];

const OnboardingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const slidesRef = React.useRef(null);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to main app
      // Save that onboarding is completed
      // await AsyncStorage.setItem('@onboarding_complete', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  };

  const handleSkip = () => {
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Skip button */}
      <Button 
        mode="text" 
        onPress={handleSkip}
        style={styles.skipButton}
        textColor={theme.colors.primary}
      >
        Skip
      </Button>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
            <MaterialCommunityIcons 
              name={onboardingData[currentIndex].icon} 
              size={60} 
              color={theme.colors.primary} 
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {onboardingData[currentIndex].title}
          </Text>
          <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {onboardingData[currentIndex].description}
          </Text>
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot, 
                { 
                  backgroundColor: index === currentIndex 
                    ? theme.colors.primary 
                    : theme.colors.outlineVariant
                }
              ]} 
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <Button 
          mode="contained" 
          onPress={handleNext}
          style={styles.nextButton}
          contentStyle={styles.nextButtonContent}
        >
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonContent: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;
