import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { Plus, Search, Trash2, Eye, User } from 'lucide-react-native'; 
import { Link, useRouter } from 'expo-router';
// تعديل المسار هنا ليناسب الهيكلية الجديدة
import { Character, getCharacters, deleteCharacter, calculateCharacterStats } from '../../services/characters'; 

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
      <TouchableOpacity style={styles.characterCard} onPress={() => router.push(`/character/${item.id}` as any)}> 
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
            {/* ... باقي العناصر بنفس النمط ... */}
          </View> 
        </View> 
        <View style={styles.cardActions}> 
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/character/${item.id}` as any)}> 
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

const styles = StyleSheet.create({ /* كما هي بدون تغيير */ });

