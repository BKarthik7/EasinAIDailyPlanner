import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, useTheme, Avatar, Divider, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Image 
            size={120} 
            source={require('../../assets/images/profile.png')} 
            style={styles.avatar}
          />
          <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onSurface }]}>
            John Doe
          </Text>
          <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
            john.doe@example.com
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>Account</List.Subheader>
            <List.Item
              title="Edit Profile"
              left={props => <List.Icon {...props} icon="account-edit" />}
            />
            <Divider />
            <List.Item
              title="Settings"
              left={props => <List.Icon {...props} icon="cog" />}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              left={props => <List.Icon {...props} icon="help-circle" />}
            />
          </List.Section>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface, marginTop: 16 }]}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary }}>More</List.Subheader>
            <List.Item
              title="About"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            <List.Item
              title="Logout"
              left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
              titleStyle={{ color: theme.colors.error }}
            />
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ProfileScreen;
