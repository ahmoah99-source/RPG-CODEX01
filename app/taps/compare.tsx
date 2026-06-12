import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { User, Swords, GitCompare } from 'lucide-react-native';
import { Character, getCharacters, calculateCharacterStats } from '@/services/characters';

const { width } = Dimensions.get('window');

export default function CompareScreen() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const [selected1, setSelected1] = useState<number | null>(null);
  const [selected2, setSelected2] = useState<number | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    const data = await getCharacters();
    setCharacters(data);
  };

  const getChar1 = (): Character | null => {
    return selected1 ? characters.find(c => c.id === selected1) || null : null;
  };

  const getChar2 = (): Character | null => {
    return selected2 ? characters.find(c => c.id === selected2) || null : null;
  };

  const renderCharacterPicker = (onSelect: (id: number) => void) => (
    <FlatList
      data={characters}
      keyExtractor={(item) => item.id!.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.pickerCard}
          onPress={() => onSelect(item.id!)}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.pickerAvatar} />
          ) : (
            <View style={styles.pickerAvatarPlaceholder}>
              <User size={24} color="#64748b" />
            </View>
          )}
          <Text style={styles.pickerName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.pickerClass}>{item.class}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderStatBar = (
    label: string,
    value1: number,
    value2: number,
    max: number = 200,
    color1: string = '#ef4444',
    color2: string = '#3b82f6'
  ) => {
    const width1 = Math.min((value1 / max) * 100, 100);
    const width2 = Math.min((value2 / max) * 100, 100);
    return (
      <View style={styles.statRow}>
        <View style={styles.statBarContainer}>
          <Text style={styles.statValueLeft}>{value1}</Text>
          <View style={styles.statBarBackground}>
            <View style={[styles.statBarFill, { width: `${width1}%`, backgroundColor: color1 }]} />
          </View>
        </View>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.statBarContainer}>
          <View style={styles.statBarBackground}>
            <View style={[styles.statBarFill, { width: `${width2}%`, backgroundColor: color2 }]} />
          </View>
          <Text style={styles.statValueRight}>{value2}</Text>
        </View>
      </View>
    );
  };

  const char1 = getChar1();
  const char2 = getChar2();
  const stats1 = char1 ? calculateCharacterStats(char1) : null;
  const stats2 = char2 ? calculateCharacterStats(char2) : null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'ساحة المقارنة',
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#e2e8f0',
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>كود المعركة</Text>
          <Text style={styles.subtitleText}>قارن بين شخصيتين</Text>
        </View>
        <View style={styles.selectorRow}>
          <TouchableOpacity
            style={[styles.selectorBox, styles.selector1]}
            onPress={() => setShowPicker1(true)}>
            {char1?.avatar ? (
              <Image source={{ uri: char1.avatar }} style={styles.selectorAvatar} />
            ) : (
              <View style={styles.selectorAvatarPlaceholder}>
                <User size={32} color="#ef4444" />
              </View>
            )}
            <Text style={styles.selectorName}>{char1?.name || 'المنافس الأول'}</Text>
            {char1 && (
              <Text style={styles.selectorClass}>Lv.{stats1?.level} – {stats1?.level_name}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <TouchableOpacity
            style={[styles.selectorBox, styles.selector2]}
            onPress={() => setShowPicker2(true)}>
            {char2?.avatar ? (
              <Image source={{ uri: char2.avatar }} style={styles.selectorAvatar} />
            ) : (
              <View style={styles.selectorAvatarPlaceholder}>
                <User size={32} color="#3b82f6" />
              </View>
            )}
            <Text style={styles.selectorName}>{char2?.name || 'المنافس الثاني'}</Text>
            {char2 && (
              <Text style={styles.selectorClass}>Lv.{stats2?.level} - {stats2?.level_name}</Text>
            )}
          </TouchableOpacity>
        </View>

        {char1 && char2 && stats1 && stats2 && (
          <View style={styles.comparisonSection}>
            <Text style={styles.sectionTitle}>الإحصائيات الأساسية</Text>
            {renderStatBar('القوة', stats1.total_strength, stats2.total_strength, 200, '#ef4444', '#3b82f6')}
            {renderStatBar('الجسد', stats1.total_body, stats2.total_body, 200, '#22c55e', '#22c55e')}
            {renderStatBar('الرشاقة', stats1.total_agility, stats2.total_agility, 200, '#f59e0b', '#f59e0b')}
            {renderStatBar('الروح', stats1.total_spirit, stats2.total_spirit, 200, '#a855f7', '#a855f7')}
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>القوة القتالية</Text>
            <View style={styles.powerComparison}>
              <View style={[styles.powerBox, styles.attackBox]}>
                <Text style={styles.powerValue}>{stats1.attack_power}</Text>
                <Text style={styles.powerLabel}>الهجوم</Text>
              </View>
              <View style={styles.powerArrow}>
                <Swords size={24} color="#94a3b8" />
              </View>
              <View style={[styles.powerBox, styles.attackBox2]}>
                <Text style={styles.powerValue}>{stats2.attack_power}</Text>
                <Text style={styles.powerLabel}>الهجوم</Text>
              </View>
            </View>

            <View style={styles.powerComparison}>
              <View style={[styles.powerBox, styles.defenseBox]}>
                <Text style={styles.powerValue}>{stats1.defense_power}</Text>
                <Text style={styles.powerLabel}>الدفاع</Text>
              </View>
              <View style={styles.powerArrow}>
                <Swords size={24} color="#94a3b8" />
              </View>
              <View style={[styles.powerBox, styles.defenseBox2]}>
                <Text style={styles.powerValue}>{stats2.defense_power}</Text>
                <Text style={styles.powerLabel}>الدفاع</Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>ملخص المعركة</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryName, stats1.attack_power > stats2.attack_power && styles.winnerText]}>
                  {char1.name}
                </Text>
                <Text style={styles.summaryType}>الهجوم الأقوى</Text>
                <Text style={[styles.summaryName, stats2.attack_power > stats1.attack_power && styles.winnerText]}>
                  {char2.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryName, stats1.defense_power > stats2.defense_power && styles.winnerText]}>
                  {char1.name}
                </Text>
                <Text style={styles.summaryType}>الدفاع الأقوى</Text>
                <Text style={[styles.summaryName, stats2.defense_power > stats1.defense_power && styles.winnerText]}>
                  {char2.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryName, stats1.level > stats2.level && styles.winnerText]}>
                  {char1.name}
                </Text>
                <Text style={styles.summaryType}>المستوى الأعلى</Text>
                <Text style={[styles.summaryName, stats2.level > stats1.level && styles.winnerText]}>
                  {char2.name}
                </Text>
              </View>
            </View>
          </View>
        )}

        {(!char1 || !char2) && (
          <View style={styles.emptySection}>
            <GitCompare size={64} color="#475569" />
            <Text style={styles.emptyText}>اختر شخصيتين للمقارنة</Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Character 1 Picker */}
      <Modal visible={showPicker1} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر المنافس الأول</Text>
            <TouchableOpacity onPress={() => setShowPicker1(false)}>
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
          {renderCharacterPicker((id) => {
            setSelected1(id);
            setShowPicker1(false);
          })}
        </View>
      </Modal>

      {/* Character 2 Picker */}
      <Modal visible={showPicker2} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>اختر المنافس الثاني</Text>
            <TouchableOpacity onPress={() => setShowPicker2(false)}>
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
          {renderCharacterPicker((id) => {
            setSelected2(id);
            setShowPicker2(false);
          })}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  titleSection: { alignItems: 'center', paddingVertical: 24, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  titleText: { fontFamily: 'Tajawal_700Bold', fontSize: 28, color: '#e2e8f0', textAlign: 'center' },
  subtitleText: { fontFamily: 'Tajawal_400Regular', fontSize: 14, color: '#94a3b8', marginTop: 4 },
  selectorRow: { flexDirection: 'row', padding: 16, gap: 8, alignItems: 'center', justifyContent: 'center' },
  selectorBox: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 2 },
  selector1: { backgroundColor: '#450a0a', borderColor: '#ef4444' },
  selector2: { backgroundColor: '#172554', borderColor: '#3b82f6' },
  selectorAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#ffffff' },
  selectorAvatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#475569' },
  selectorName: { fontFamily: 'Tajawal_700Bold', fontSize: 16, color: '#e2e8f0', marginTop: 12, textAlign: 'center' },
  selectorClass: { fontFamily: 'Tajawal_400Regular', fontSize: 12, color: '#94a3b8', marginTop: 4 },
  vsContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  vsText: { fontFamily: 'Tajawal_700Bold', fontSize: 20, color: '#f59e0b' },
  comparisonSection: { paddingHorizontal: 16 },
  sectionTitle: { fontFamily: 'Tajawal_700Bold', fontSize: 18, color: '#e2e8f0', textAlign: 'center', marginVertical: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  statBarContainer: { flexDirection: 'row', alignItems: 'center', width: '40%' },
  statValueLeft: { fontFamily: 'Tajawal_700Bold', fontSize: 16, color: '#ef4444', marginLeft: 8 },
  statValueRight: { fontFamily: 'Tajawal_700Bold', fontSize: 16, color: '#3b82f6', marginRight: 8 },
  statBarBackground: { flex: 1, height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 4 },
  statLabel: { fontFamily: 'Tajawal_500Medium', fontSize: 14, color: '#e2e8f0', width: '20%', textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 16 },
  powerComparison: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 16 },
  powerBox: { width: 100, padding: 16, borderRadius: 12, alignItems: 'center' },
  attackBox: { backgroundColor: '#7f1d1d', borderColor: '#ef4444', borderWidth: 2 },
  attackBox2: { backgroundColor: '#1e3a5f', borderColor: '#3b82f6', borderWidth: 2 },
  defenseBox: { backgroundColor: '#14532d', borderColor: '#22c55e', borderWidth: 2 },
  defenseBox2: { backgroundColor: '#1e3a5f', borderColor: '#3b82f6', borderWidth: 2 },
  powerValue: { fontFamily: 'Tajawal_700Bold', fontSize: 32, color: '#ffffff' },
  powerLabel: { fontFamily: 'Tajawal_400Regular', fontSize: 12, color: '#e2e8f0', marginTop: 4 },
  powerArrow: { alignItems: 'center' },
  summaryBox: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  summaryName: { fontFamily: 'Tajawal_500Medium', fontSize: 14, color: '#94a3b8', width: '30%', textAlign: 'center' },
  winnerText: { color: '#f59e0b', fontFamily: 'Tajawal_700Bold' },
  summaryType: { fontFamily: 'Tajawal_500Medium', fontSize: 14, color: '#e2e8f0', width: '40%', textAlign: 'center' },
  emptySection: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontFamily: 'Tajawal_500Medium', fontSize: 16, color: '#64748b', marginTop: 16 },
  bottomPadding: { height: 100 },
  modalContainer: { flex: 1, backgroundColor: '#0f172a' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  modalTitle: { fontFamily: 'Tajawal_700Bold', fontSize: 20, color: '#e2e8f0' },
  closeText: { fontFamily: 'Tajawal_500Medium', fontSize: 16, color: '#3b82f6' },
  pickerCard: { flex: 1, margin: 8, padding: 12, backgroundColor: '#1e293b', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  pickerAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#3b82f6' },
  pickerAvatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#475569' },
  pickerName: { fontFamily: 'Tajawal_500Medium', fontSize: 14, color: '#e2e8f0', marginTop: 8 },
  pickerClass: { fontFamily: 'Tajawal_400Regular', fontSize: 12, color: '#64748b', marginTop: 2 }
});
