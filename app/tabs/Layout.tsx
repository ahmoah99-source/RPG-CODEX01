import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import {
  Users,
  Swords,
  Shield,
  Sparkles,
  GitCompare,
  Settings,
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1e293b',
          borderBottomColor: '#334155',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#e2e8f0',
          fontFamily: 'Tajawal_700Bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontFamily: 'Tajawal_500Medium',
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 1,
          borderTopColor: '#334155',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الشخصيات',
          headerTitle: 'سِجِلّ الشّخصيّات',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weapons"
        options={{
          title: 'الأسلحة',
          headerTitle: 'مخزن الأسلحة',
          tabBarIcon: ({ size, color }) => (
            <Swords size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="armors"
        options={{
          title: 'الدروع',
          headerTitle: 'مخزن الدروع',
          tabBarIcon: ({ size, color }) => (
            <Shield size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: 'المهارات',
          headerTitle: 'المواهب والمهارات',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'المقارنة',
          headerTitle: 'ساحة المقارنة',
          tabBarIcon: ({ size, color }) => (
            <GitCompare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          headerTitle: 'الإعدادات',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1e293b',
  },
}); 
