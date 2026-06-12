import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { Plus, Search, Edit2, Trash2, Eye, User } from 'lucide-react-native'; 
import { Link, useRouter } from 'expo-router';
import { Character, getCharacters, deleteCharacter, calculateCharacterStats, CLASSES, LEVELS } from '@/services/characters'; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; 

export default function CharactersScreen() { 
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const router = useRouter();

  const loadCharacters = useCallback(async () => { 
    try { 
      const data = await getCharacters(searchQuery); 
      setCharacters(data); 
    } catch (error) { 
      console.error('Error loading characters:', error); 
    } 
  }, [searchQuery]);

  useEffect(() => { 
    loadCharacters(); 
  }, [loadCharacters]); 

  const handleDelete = (character: Character) => { 
    Alert.alert(
      'تأكيد الحذف', 
      `هل أنت متأكد من حذف "${character.name}"؟`, 
      [ 
        { text: 'إلغاء', style: 'cancel' }, 
        { 
          text: 'حذف', 
          style: 'destructive', 
          onPress: async () => { 
            try { 
              await deleteCharacter(character.id!); 
              loadCharacters(); 
              Alert.alert('تم', 'تم حذف الشخصية'); 
            } catch (error) { 
              Alert.alert('خطأ', 'حدث خطأ أثناء الحذف'); 
            } 
          }, 
        }, 
      ] 
    ); 
  };

  const renderCharacter = ({ item }: { item: Character }) => { 
    const stats = calculateCharacterStats(item);
    return ( 
      <TouchableOpacity style={styles.characterCard} onPress={() => router.push(`/character/${item.id}`)}> 
        <View style={styles.avatarContainer}> 
          {item.avatar ? ( 
            <Image source={{ uri: item.avatar }} style={styles.avatar} /> 
          ) : ( 
            <View style={styles.avatarPlaceholder}> 
              <User size={32} color="#64748b" /> 
            </View> 
          )} 
          <View style={styles.levelBadge}> 
            <Text style={styles.levelText}>Lv.{stats.level}</Text> 
          </View> 
        </View> 
        <View style={styles.cardContent}> 
          <Text style={styles.characterName} numberOfLines={1}>{item.name}</Text> 
          {item.title && ( 
            <Text style={styles.characterTitle} numberOfLines={1}>{item.title}</Text> 
          )} 
          <Text style={styles.className}>{item.class}</Text> 
          <View style={styles.statsGrid}> 
            <View style={styles.statItem}> 
              <Text style={styles.statValue}>{item.strength}</Text> 
              <Text style={styles.statLabel}>قوة</Text> 
            </View> 
            <View style={styles.statItem}> 
              <Text style={styles.statValue}>{item.body}</Text> 
              <Text style={styles.statLabel}>جسد</Text> 
            </View> 
            <View style={styles.statItem}> 
              <Text style={styles.statValue}>{item.agility}</Text> 
              <Text style={styles.statLabel}>رشاقة</Text> 
            </View> 
            <View style={styles.statItem}> 
              <Text style={styles.statValue}>{item.spirit}</Text> 
              <Text style={styles.statLabel}>روح</Text> 
            </View> 
          </View> 
          <View style={styles.powerRow}> 
            <View style={[styles.powerBadge, styles.attackBadge]}> 
              <Text style={styles.powerText}>هجوم: {stats.attack_power}</Text> 
            </View> 
            <View style={[styles.powerBadge, styles.defenseBadge]}> 
              <Text style={styles.powerText}>دفاع: {stats.defense_power}</Text> 
            </View> 
          </View> 
          <Text style={styles.levelName}>{stats.level_name}</Text> 
        </View> 
        <View style={styles.cardActions}> 
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/character/${item.id}`)}> 
            <Eye size={18} color="#3b82f6" /> 
          </TouchableOpacity> 
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}> 
            <Trash2 size={18} color="#ef4444" /> 
          </TouchableOpacity> 
        </View> 
      </TouchableOpacity> 
    );
  }; 

  return ( 
    <View style={styles.container}> 
      <View style={styles.searchContainer}> 
        <Search size={20} color="#94a3b8" /> 
        <TextInput 
          style={styles.searchInput} 
          placeholder="بحث عن شخصية..." 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholderTextColor="#94a3b8" 
        /> 
      </View> 
      <Link href="/character/new" asChild> 
        <TouchableOpacity style={styles.addButton}> 
          <Plus size={24} color="#ffffff" /> 
          <Text style={styles.addButtonText}>إنشاء شخصية جديدة</Text> 
        </TouchableOpacity> 
      </Link> 
      {characters.length === 0 ? ( 
        <View style={styles.emptyContainer}> 
          <User size={64} color="#64748b" /> 
          <Text style={styles.emptyText}>لا توجد شخصيات</Text> 
        </View> 
      ) : ( 
        <FlatList 
          data={characters} 
          renderItem={renderCharacter} 
          keyExtractor={(item) => item.id!.toString()} 
          numColumns={2} 
          contentContainerStyle={styles.listContainer} 
        /> 
      )} 
    </View> 
  ); 
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#0f172a', padding: 16 }, searchContainer: { flexDirection: 'row', backgroundColor: '#1e293b', alignItems: 'center', paddingHorizontal: 12, borderRadius: 8, marginBottom: 16 }, searchInput: { flex: 1, height: 45, color: '#fff', marginLeft: 8, textAlign: 'right' }, addButton: { backgroundColor: '#3b82f6', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 48, borderRadius: 8, gap: 8, marginBottom: 16 }, addButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Tajawal_700Bold' }, listContainer: { paddingBottom: 20 }, characterCard: { width: CARD_WIDTH, backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 16, marginRight: 16, borderWidth: 1, borderColor: '#334155' }, avatarContainer: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }, avatar: { width: '100%', height: '100%' }, avatarPlaceholder: { justifyContent: 'center', alignItems: 'center' }, levelBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#3b82f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }, levelText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }, cardContent: { marginTop: 8, alignItems: 'flex-end' }, characterName: { color: '#fff', fontSize: 16, fontFamily: 'Tajawal_700Bold' }, characterTitle: { color: '#94a3b8', fontSize: 12, fontFamily: 'Tajawal_400Regular', marginTop: 2 }, className: { color: '#3b82f6', fontSize: 12, fontFamily: 'Tajawal_500Medium', marginTop: 2 }, statsGrid: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 }, statItem: { alignItems: 'center', flex: 1 }, statValue: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, statLabel: { color: '#64748b', fontSize: 10, marginTop: 2 }, powerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8, gap: 4 }, powerBadge: { flex: 1, paddingVertical: 4, borderRadius: 4, alignItems: 'center' }, attackBadge: { backgroundColor: '#7f1d1d' }, defenseBadge: { backgroundColor: '#14532d' }, powerText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }, levelName: { color: '#f59e0b', fontSize: 11, fontFamily: 'Tajawal_500Medium', marginTop: 6, alignSelf: 'center' }, cardActions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8, marginTop: 8 }, actionButton: { padding: 4 }, emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }, emptyText: { color: '#64748b', fontSize: 16, marginTop: 16 } });
