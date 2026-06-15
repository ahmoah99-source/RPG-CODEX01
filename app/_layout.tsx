import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { loadDatabase } from '../services/database';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from '@expo-google-fonts/tajawal';
import { SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  useEffect(() => {
    // تعديل الفتح الآمن: التطبيق سيفتح في كل الحالات
    loadDatabase()
      .then(() => setDbReady(true))
      .catch((e) => {
        console.error("Database load error:", e);
        setDbReady(true); 
      });
  }, []);

  useEffect(() => {
    // إخفاء الـ SplashScreen بمجرد انتهاء المحاولة (سواء نجحت أو فشلت)
    if ((fontsLoaded || fontError) && dbReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, dbReady]);

  if (!fontsLoaded && !fontError && !dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" />
        <Stack.Screen name="character/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { marginTop: 16, fontSize: 16, fontFamily: 'Tajawal_500Medium', color: '#94a3b8' },
});
