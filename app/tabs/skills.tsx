import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Zap, Trash2 } from 'lucide-react-native';
import { loadSkills, saveSkills, Skill } from '../../services/Skills';

export default function SkillsScreen() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [tier, setTier] = useState<string>('F');
  const [multiplier, setMultiplier] = useState('');
  const [staticBoost, setStaticBoost] = useState('');
  
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const data = await loadSkills();
    setSkills(data);
  };

  const handleAddSkill = async () => {
    if (!name || !multiplier) {
      Alert.alert('خطأ', 'الرجاء كتابة اسم الموهبة والمضاعف الأساسي');
      return;
    }
    const newSkill: Skill = {
      id: Date.now().toString(),
      name,                     
      tier,                     
      multiplier: parseFloat(multiplier) || 1.0,
      staticBoost: parseFloat(staticBoost) || 0
    };
    const updated = [...skills, newSkill];
    setSkills(updated);
    await saveSkills(updated);
    setName('');
    setMultiplier('');
    setStaticBoost('');
    setTier('F');
  };

  const handleDeleteSkill = async (id: string) => {
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    await saveSkills(updated);
  };
  
  const tiers = ['F', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>سجل المواهب والقدرات</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>توثيق موهبة / جين جديد</Text>
        <TextInput style={styles.input} placeholder="اسم الموهبة" placeholderTextColor="#94a3b8" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="المضاعف الإحصائي (مثال: 1.5)" placeholderTextColor="#94a3b8" keyboardType="numeric" value={multiplier} onChangeText={setMultiplier} />
        <TextInput style={styles.input} placeholder="زيادة رقمية ثابتة" placeholderTextColor="#94a3b8" keyboardType="numeric" value={staticBoost} onChangeText={setStaticBoost} />
        
        <Text style={styles.label}>تصنيف درجة الموهبة (Tier):</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tierScroll}>
          {tiers.map((t) => (
            <TouchableOpacity key={t} style={[styles.tierBtn, tier === t && styles.tierBtnActive]} onPress={() => setTier(t)}>
              <Text style={styles.tierBtnText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddSkill}>
          <Zap color="#fff" size={20} />
          <Text style={styles.addBtnText}>حفظ الموهبة في النظام</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>المواهب المسجلة بالسيستم ({skills.length})</Text>
      {skills.map((skill) => (
        <View key={skill.id} style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.tierBadge, { backgroundColor: skill.tier.includes('S') || skill.tier === 'EX' ? '#ef4444' : '#3b82f6' }]}>
                <Text style={styles.tierBadgeText}>{skill.tier}</Text>
              </View>
              <Text style={styles.skillName}>{skill.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteSkill(skill.id)}>
              <Trash2 color="#ef4444" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.skillDetails}>
            <Text style={styles.detailText}>المضاعف الإحصائي: {skill.multiplier}x</Text>
            {skill.staticBoost > 0 && <Text style={styles.detailText}>الزيادة الثابتة: +{skill.staticBoost}</Text>}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', textAlign: 'right', marginBottom: 20 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 20 },
  cardTitle: { fontSize: 18, color: '#a855f7', marginBottom: 12, textAlign: 'right' },
  input: { backgroundColor: '#334155', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12, textAlign: 'right' },
  label: { color: '#94a3b8', textAlign: 'right', marginBottom: 8 },
  tierScroll: { flexDirection: 'row', gap: 8, paddingBottom: 10 },
  tierBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#334155', borderRadius: 6, minWidth: 45, alignItems: 'center' },
  tierBtnActive: { backgroundColor: '#a855f7' },
  tierBtnText: { color: '#fff', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#a855f7', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, color: '#e2e8f0', textAlign: 'right', marginBottom: 12 },
  skillCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 10 },
  skillHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tierBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  tierBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  skillName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  skillDetails: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  detailText: { color: '#94a3b8', fontSize: 13 }
});
