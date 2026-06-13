import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ShoppingBag, Plus, Trash2 } from 'lucide-react-native';

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const addProduct = () => {
    if (name && price) {
      setProducts([...products, { id: Date.now().toString(), name, price }]);
      setName('');
      setPrice('');
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>إدارة المتجر والمنتجات</Text>
      
      <View style={styles.card}>
        <TextInput 
          style={styles.input} 
          placeholder="اسم المنتج" 
          placeholderTextColor="#94a3b8" 
          value={name} 
          onChangeText={setName} 
          textAlign="right"
        />
        <TextInput 
          style={styles.input} 
          placeholder="السعر" 
          placeholderTextColor="#94a3b8" 
          keyboardType="numeric" 
          value={price} 
          onChangeText={setPrice} 
          textAlign="right"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
          <Plus color="#fff" size={20} />
          <Text style={styles.addBtnText}>إضافة للمتجر</Text>
        </TouchableOpacity>
      </View>

      {products.map((item) => (
        <View key={item.id} style={styles.productCard}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
            <ShoppingBag color="#38bdf8" size={20} />
            <Text style={styles.productName}>{item.name}</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 15 }}>
            <Text style={styles.priceText}>{item.price} عملة</Text>
            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
              <Trash2 color="#ef4444" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16, paddingTop: 40 },
  title: { fontSize: 22, color: '#f8fafc', textAlign: 'right', marginBottom: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 20 },
  input: { backgroundColor: '#334155', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, textAlign: 'right' },
  addBtn: { backgroundColor: '#38bdf8', padding: 12, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  productCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 10, marginBottom: 8, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  productName: { color: '#e2e8f0', fontSize: 16 },
  priceText: { color: '#38bdf8', fontWeight: 'bold' }
});

