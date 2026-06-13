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
// تم تعديل المسار هنا ليكون مساراً نسبياً
import { Character, getCharacters, calculateCharacterStats } from '../../services/characters';

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
        {/* ... بقية الـ UI كما هي ... */}
        {/* نصيحة: تأكد من مراجعة باقي ملفاتك بنفس الطريقة */}
      </ScrollView>
      {/* ... بقية المودال والـ Pickers ... */}
    </>
  );
}

// styles كما هي بدون تغيير
const styles = StyleSheet.create({
  // ...
});

