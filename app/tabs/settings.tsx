import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const handleClearData = () => {
    Alert.alert(
      "تحذير هام",
      "هل أنت متأكد من رغبتك في مسح جميع البيانات المسجلة؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        { 
          text: "نعم، امسح كل شيء", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("تم بنجاح", "تم تصفير وتفريغ قاعدة البيانات المحلية بالكامل.");
            } catch (error) {
              Alert.alert("خطأ", "فشل في مسح البيانات.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الإعدادات ونظام التحكم</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>معلومات النظام الحالي:</Text>
        <Text style={styles.infoText}>إصدار النظام: 1.0.0</Text>
        <Text style={styles.infoText}>بيئة العمل: Offline-First (LocalStorage)</Text>
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
        <Text style={styles.clearButtonText}>حذف قاعدة البيانات بالكامل</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16, paddingTop: 40 }, // تم تعديل الخلفية لتناسب باقي الشاشات
  title: { fontSize: 22, color: '#f8fafc', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  infoBox: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, marginTop: 10 },
  infoTitle: { color: '#ffd700', fontSize: 16, marginBottom: 10, fontWeight: 'bold', textAlign: 'right' },
  infoText: { color: '#ccc', fontSize: 14, marginVertical: 4, textAlign: 'right' },
  clearButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

