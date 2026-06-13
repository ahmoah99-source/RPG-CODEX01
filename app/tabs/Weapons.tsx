import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Sword, Plus, Trash2, ShieldAlert } from 'lucide-react-native';
import { loadWeapons, saveWeapons, Weapon } from '../../services/weapons';

export default function WeaponsScreen() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [name, setName] = useState('');
  const [baseDamage, setBaseDamage] = useState('');
  const [rarity, setRarity] = useState<'Normal' | 'Rare' | 'Epic' | 'Legendary'>('Normal');
  const [cost, setCost] = useState('');
  
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const data = await loadWeapons();
    setWeapons(data);
  };

  const handleAddWeapon = async () => {
    if (!name || !baseDamage || !cost) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    const newWeapon: Weapon = {
      Id: Date.now().toString(),
      Name,
      baseDamage: parseFloat(baseDamage) || 0,
      rarity,
      Cost: parseFloat(cost) || 0,
    };
    const updated = [...weapons, newWeapon];
    setWeapons(updated);
    await saveWeapons(updated);
    setName('');
    setBaseDamage('');
    setCost('');
    setRarity('Normal');
  };

  const handleDeleteWeapon = async (id: string) => {
    const updated = weapons.filter(w => w.Id !== id);
    setWeapons(updated);
    await saveWeapons(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ترسانة الأسلحة</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>حدادة سلاح جديد</Text>
        <TextInput style={styles.input} placeholder="اسم السلاح" placeholderTextColor="#94a3b8" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="الضرر الأساسي" placeholderTextColor="#94a3b8" keyboardType="numeric" value={baseDamage} onChangeText={setBaseDamage} />
        <TextInput style={styles.input} placeholder="التكلفة (عملة)" placeholderTextColor="#94a3b8" keyboardType="numeric" value={cost} onChangeText={setCost} />
       
        <Text style={styles.label}>درجة الندرة:</Text>
        <View style={styles.rarityContainer}>
          {(['Normal', 'Rare', 'Epic', 'Legendary'] as const).map(r => (
            <TouchableOpacity key={r} style={[styles.rarityBtn, rarity === r && styles.rarityBtnActive]} onPress={() => setRarity(r)}>
              <Text style={styles.rarityBtnText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddWeapon}>
          <Plus color="#fff" size={20} />
          <Text style={styles.addBtnText}>إضافة السلاح للترسانة</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>الأسلحة الحالية ({weapons.length})</Text>
      {weapons.map((item) => (
        <View key={item.id} style={styles.weaponCard}>
          <View style={styles.weaponHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Sword color="#f59e0b" size={20} />
              <Text style={styles.weaponName}>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteWeapon(item.id)}>
              <Trash2 color="#ef4444" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.weaponDetails}>
            <Text style={styles.detailText}>الضرر الأساسي: {item.baseDamage}</Text>
            <Text style={[styles.detailText, styles[item.rarity.toLowerCase() as 'normal' | 'rare' | 'epic' | 'legendary']]}>الندرة: {item.rarity}</Text>
            <Text style={styles.detailText}>القيمة: {item.cost} عملة</Text>
          </View>
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', textAlign: 'right', marginBottom: 20, fontFamily: 'Tajawal' },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 20 },
  cardTitle: { fontSize: 18, color: '#38bdf8', marginBottom: 12, textAlign: 'right' },
  input: { backgroundColor: '#334155', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12, textAlign: 'right' },
  label: { color: '#94a3b8', textAlign: 'right', marginBottom: 8 },
  rarityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 4 },
  rarityBtn: { flex: 1, padding: 8, backgroundColor: '#334155', borderRadius: 6, alignItems: 'center' },
  rarityBtnActive: { backgroundColor: '#38bdf8' },
  rarityBtnText: { color: '#fff', fontSize: 12 },
  addBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, color: '#e2e8f0', textAlign: 'right', marginBottom: 12 },
  weaponCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  weaponHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  weaponName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  weaponDetails: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  detailText: { color: '#94a3b8', fontSize: 13 },
  normal: { color: '#94a3b8' },
  rare: { color: '#3b82f6' },
  epic: { color: '#a855f7' },
  legendary: { color: '#f59e0b' }
});
