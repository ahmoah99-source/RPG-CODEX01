import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Plus, Search, Edit2, Trash2, X, Shield } from 'lucide-react-native';
import {
  Armor,
  getArmors,
  addArmor,
  updateArmor,
  deleteArmor,
  generateArmorCode,
} from '../../services/armors';

export default function ArmorsScreen() {
  const [armors, setArmors] = useState<Armor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArmor, setEditingArmor] = useState<Armor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'درع',
    description: '',
    strength_bonus: '0',
    agility_bonus: '0',
    spirit_bonus: '0',
    body_bonus: '0',
    defense_multiplier: '1',
    min_strength_req: '0',
    min_body_req: '0',
    min_agility_req: '0',
    min_spirit_req: '0',
    min_level_req: '0',
  });

  const armorTypes = ['درع', 'خوذة', 'قفازات', 'حذاء', 'حزام', 'عباءة'];

  const loadArmors = useCallback(async () => {
    try {
      const data = await getArmors(searchQuery);
      setArmors(data);
    } catch (error) {
      console.error('Error loading armors:', error);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadArmors();
  }, [loadArmors]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'درع',
      description: '',
      strength_bonus: '0',
      agility_bonus: '0',
      spirit_bonus: '0',
      body_bonus: '0',
      defense_multiplier: '1',
      min_strength_req: '0',
      min_body_req: '0',
      min_agility_req: '0',
      min_spirit_req: '0',
      min_level_req: '0',
    });
    setEditingArmor(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (armor: Armor) => {
    setEditingArmor(armor);
    setFormData({
      name: armor.name,
      type: armor.type,
      description: armor.description || '',
      strength_bonus: armor.strength_bonus.toString(),
      agility_bonus: armor.agility_bonus.toString(),
      spirit_bonus: armor.spirit_bonus.toString(),
      body_bonus: armor.body_bonus.toString(),
      defense_multiplier: armor.defense_multiplier.toString(),
      min_strength_req: armor.min_strength_req.toString(),
      min_body_req: armor.min_body_req.toString(),
      min_agility_req: armor.min_agility_req.toString(),
      min_spirit_req: armor.min_spirit_req.toString(),
      min_level_req: armor.min_level_req.toString(),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('خطأ', 'اسم الدرع مطلوب');
      return;
    }
    try {
      const armorData: Armor = {
        code: editingArmor?.code || await generateArmorCode(),
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        strength_bonus: parseFloat(formData.strength_bonus) || 0,
        agility_bonus: parseFloat(formData.agility_bonus) || 0,
        spirit_bonus: parseFloat(formData.spirit_bonus) || 0,
        body_bonus: parseFloat(formData.body_bonus) || 0,
        defense_multiplier: parseFloat(formData.defense_multiplier) || 1,
        min_strength_req: parseFloat(formData.min_strength_req) || 0,
        min_body_req: parseFloat(formData.min_body_req) || 0,
        min_agility_req: parseFloat(formData.min_agility_req) || 0,
        min_spirit_req: parseFloat(formData.min_spirit_req) || 0,
        min_level_req: parseFloat(formData.min_level_req) || 0,
      };

      if (editingArmor?.id) {
        await updateArmor(editingArmor.id, armorData);
        Alert.alert('تم', 'تم تحديث الدرع بنجاح');
      } else {
        await addArmor(armorData);
        Alert.alert('تم', 'تم إضافة الدرع بنجاح');
      }
      setModalVisible(false);
      resetForm();
      loadArmors();
    } catch (error) {
      console.error('Error saving armor:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = (armor: Armor) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف "${armor.name}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteArmor(armor.id!);
              loadArmors();
              Alert.alert('تم', 'تم حذف الدرع');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء الحذف');
            }
          },
        },
      ]
    );
  };

  const renderArmor = ({ item }: { item: Armor }) => (
    <TouchableOpacity style={styles.armorCard} onPress={() => openEditModal(item)}>
      <View style={styles.armorIcon}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.armorImage} />
        ) : (
          <Shield size={32} color="#3b82f6" />
        )}
      </View>
      <View style={styles.armorInfo}>
        <Text style={styles.armorCode}>{item.code}</Text>
        <Text style={styles.armorName}>{item.name}</Text>
        <Text style={styles.armorType}>{item.type}</Text>
        <View style={styles.bonusGrid}>
          {item.body_bonus > 0 && <View style={styles.bonusItem}><Text style={styles.bonusLabel}>جسد +{item.body_bonus}</Text></View>}
          {item.spirit_bonus > 0 && <View style={styles.bonusItem}><Text style={styles.bonusLabel}>روح +{item.spirit_bonus}</Text></View>}
        </View>
        <View style={styles.defenseRow}>
          <View style={styles.defenseBadge}><Text style={styles.defenseText}>دفاع x{item.defense_multiplier}</Text></View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}><Edit2 size={18} color="#3b82f6" /></TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}><Trash2 size={18} color="#ef4444" /></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" />
        <TextInput style={styles.searchInput} placeholder="بحث عن درع..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#94a3b8" textAlign="right" />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Plus size={24} color="#ffffff" /><Text style={styles.addButtonText}>إضافة درع جديد</Text>
      </TouchableOpacity>
      {armors.length === 0 ? (
        <View style={styles.emptyContainer}><Shield size={64} color="#475569" /><Text style={styles.emptyText}>لا توجد دروع</Text></View>
      ) : (
        <FlatList data={armors} renderItem={renderArmor} keyExtractor={(item) => item.id!.toString()} />
      )}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingArmor ? 'تعديل الدرع' : 'إضافة درع جديد'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#e2e8f0" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>اسم الدرع *</Text>
                <TextInput style={styles.formInput} value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} textAlign="right" />
              </View>
              {/* باقي الحقول هنا بنفس النمط.. */}
              <TouchableOpacity style={styles.addButton} onPress={handleSave}><Text style={styles.addButtonText}>حفظ</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#1e293b', alignItems: 'center', paddingHorizontal: 12, borderRadius: 8, marginBottom: 16, marginTop: 10 },
  searchInput: { flex: 1, height: 45, color: '#fff', marginLeft: 8, textAlign: 'right' },
  addButton: { backgroundColor: '#3b82f6', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 48, borderRadius: 8, gap: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', fontSize: 16 },
  armorCard: { flexDirection: 'row-reverse', backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  armorIcon: { justifyContent: 'center', alignItems: 'center', width: 50 },
  armorImage: { width: 40, height: 40, borderRadius: 8 },
  armorInfo: { flex: 1, alignItems: 'flex-end', paddingRight: 10 },
  armorCode: { color: '#64748b', fontSize: 11 },
  armorName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  armorType: { color: '#3b82f6', fontSize: 12 },
  bonusGrid: { flexDirection: 'row', gap: 6, marginTop: 6 },
  bonusItem: { backgroundColor: '#334155', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  bonusLabel: { color: '#fff', fontSize: 11 },
  defenseRow: { marginTop: 6 },
  defenseBadge: { backgroundColor: '#14532d', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  defenseText: { color: '#fff', fontSize: 11 },
  actions: { justifyContent: 'space-between', alignItems: 'center' },
  editButton: { padding: 4 },
  deleteButton: { padding: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#64748b', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)' },
  modalContent: { backgroundColor: '#1e293b', margin: 20, borderRadius: 12, padding: 16 },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  formGroup: { marginBottom: 16 },
  formLabel: { color: '#94a3b8', marginBottom: 6, textAlign: 'right' },
  formInput: { backgroundColor: '#334155', color: '#fff', height: 40, borderRadius: 6, paddingHorizontal: 10 },
  typeSelector: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },
  typeChip: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  typeChipActive: { backgroundColor: '#3b82f6' },
  typeChipText: { color: '#94a3b8', fontSize: 12 },
  typeChipTextActive: { color: '#fff' }
});

