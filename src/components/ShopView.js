import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ShopView({ codexEngine, heroId, theme, dict }) {
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const categories = codexEngine.getShopCategories();
    const allItems = codexEngine.getData('shop');

    const filteredItems = selectedCategory === 'الكل' 
        ? allItems 
        : allItems.filter(item => item.category === selectedCategory);

    const handleBuy = (item) => {
        if (!heroId) {
            alert("⚠️ برجاء اختيار بطل أولاً من الشاشة الرئيسية أو قائمة الأبطال!");
            return;
        }
        const res = codexEngine.buyShopItem(heroId, item);
        alert(res.msg);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.accent }]}>🏛️ المتجر الأسطوري</Text>
            
            {/* سلايدر فئات المتجر */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTrack}>
                <TouchableOpacity 
                    style={[styles.catChip, selectedCategory === 'الكل' && { backgroundColor: theme.accent }]}
                    onPress={() => setSelectedCategory('الكل')}
                >
                    <Text style={[styles.catText, selectedCategory === 'الكل' && styles.activeCatText]}>الكل</Text>
                </TouchableOpacity>

                {Object.keys(categories).map((catName, idx) => (
                    <TouchableOpacity 
                        key={idx}
                        style={[styles.catChip, selectedCategory === catName && { backgroundColor: theme.accent }]}
                        onPress={() => setSelectedCategory(catName)}
                    >
                        <Text style={[styles.catText, selectedCategory === catName && styles.activeCatText]}>{catName}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* قائمة المنتجات */}
            <ScrollView contentContainerStyle={styles.itemsGrid}>
                {filteredItems.length === 0 ? (
                    <Text style={styles.emptyText}>لا توجد منتجات في هذه الفئة حالياً.</Text>
                ) : (
                    filteredItems.map((item, idx) => (
                        <View key={idx} style={styles.itemCard}>
                            <Image source={{ uri: item.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.itemImg} resizeMode="cover" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemPrice}>💰 {item.price} قطعة ذهبية</Text>
                                <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
                                <View style={styles.bonusRow}>
                                    {item.bonusStr > 0 && <Text style={styles.bonusText}>ق:+{item.bonusStr}</Text>}
                                    {item.bonusAgi > 0 && <Text style={styles.bonusText}>ر:+{item.bonusAgi}</Text>}
                                    {item.bonusBody > 0 && <Text style={styles.bonusText}>ج:+{item.bonusBody}</Text>}
                                    {item.bonusSpirit > 0 && <Text style={styles.bonusText}>رة:+{item.bonusSpirit}</Text>}
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={[styles.buyBtn, { backgroundColor: theme.accent }]}
                                onPress={() => handleBuy(item)}
                            >
                                <Text style={styles.buyBtnText}>شراء</Text>
                            </TouchableOpacity>
                        </View>
                    ))
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';

export default function ShopView({ codexEngine, heroId, theme, dict }) {
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [selectedItem, setSelectedItem] = useState(null);
    
    // نوافذ الشراء واختيار البطل
    const [modalVisible, setModalVisible] = useState(false);
    const [heroSearchQuery, setHeroSearchQuery] = useState('');
    const [selectedHeroPathForBuy, setSelectedHeroPathForBuy] = useState('');

    const categories = codexEngine.getShopCategories();
    const allItems = codexEngine.getData('shop') || [];
    const rawHeroes = codexEngine.getData('heroes') || [];

    const filteredItems = selectedCategory === 'الكل' 
        ? allItems 
        : allItems.filter(item => item.category === selectedCategory);

    const handleBuyItem = () => {
        if (!selectedHeroPathForBuy || !selectedItem) {
            alert("⚠️ برجاء اختيار بطل أولاً لاستلام السلعة!");
            return;
        }

        const res = codexEngine.buyItemForHero(selectedHeroPathForBuy, selectedItem);
        alert(res.msg);
        if (res.success) {
            setModalVisible(false);
            setSelectedItem(null);
        }
    };

    return (
        <View style={styles.container}>
            {selectedItem ? (
                <View style={styles.detailsBox}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: theme.accent }]}
                        onPress={() => setSelectedItem(null)}
                    >
                        <Text style={styles.btnText}>⬅️ العودة للمتجر</Text>
                    </TouchableOpacity>

                    <View style={styles.detailsContent}>
                        <Image source={{ uri: selectedItem.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.detailsImg} resizeMode="cover" />
                        <Text style={[styles.itemNameLarge, { color: theme.accent }]}>{selectedItem.name}</Text>
                        <Text style={styles.itemPriceText}>💰 السعر: {selectedItem.price} قطعة ذهبية</Text>
                        <Text style={styles.itemCategoryText}>التصنيف: {selectedItem.category}</Text>

                        <View style={styles.statsBox}>
                            <Text style={styles.statsBoxTitle}>الخصائص:</Text>
                            <Text style={styles.statsText}>
                                القوة +{selectedItem.bonusStr} | الرشاقة +{selectedItem.bonusAgi} | الجسد +{selectedItem.bonusBody} | الروح +{selectedItem.bonusSpirit}
                            </Text>
                        </View>

                        <Text style={styles.descText}>{selectedItem.desc || "لا يوجد وصف."}</Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: '#2ed573' }]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.btnText}>🛒 شراء وإرسال للبطل</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.mainContainer}>
                    <Text style={[styles.title, { color: theme.accent }]}>🏛️ المتجر الأسطوري</Text>

                    {/* سلايدر فئات المتجر */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTrack}>
                        <TouchableOpacity 
                            style={[styles.catChip, selectedCategory === 'الكل' && { backgroundColor: theme.accent }]}
                            onPress={() => setSelectedCategory('الكل')}
                        >
                            <Text style={[styles.catText, selectedCategory === 'الكل' && styles.activeCatText]}>الكل</Text>
                        </TouchableOpacity>

                        {Object.keys(categories).map((catName, idx) => (
                            <TouchableOpacity 
                                key={idx}
                                style={[styles.catChip, selectedCategory === catName && { backgroundColor: theme.accent }]}
                                onPress={() => setSelectedCategory(catName)}
                            >
                                <Text style={[styles.catText, selectedCategory === catName && styles.activeCatText]}>{catName}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* شبكة المنتجات */}
                    <ScrollView contentContainerStyle={styles.itemsGrid}>
                        {filteredItems.length === 0 ? (
                            <Text style={styles.emptyText}>لا توجد منتجات في هذا التصنيف حالياً.</Text>
                        ) : (
                            filteredItems.map((item, idx) => (
                                <TouchableOpacity key={idx} style={styles.gridCell} onPress={() => setSelectedItem(item)}>
                                    <Image source={{ uri: item.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.cellImg} resizeMode="cover" />
                                    <Text style={styles.cellName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.cellPrice}>💰 {item.price}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
            )}

            {/* نافذة اختيار البطل لإتمام الشراء */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>🛡️ اختر البطل لاستلام السلعة ({selectedItem?.name})</Text>
                        
                        <TextInput 
                            style={styles.modalSearchInput}
                            placeholder="🔍 ابحث عن اسم البطل..."
                            placeholderTextColor="#a1a1aa"
                            value={heroSearchQuery}
                            onChangeText={setHeroSearchQuery}
                        />

                        <ScrollView style={styles.heroSelectList}>
                            {rawHeroes
                                .filter(h => h.name.toLowerCase().includes(heroSearchQuery.toLowerCase()))
                                .map(h => (
                                    <TouchableOpacity 
                                        key={h.id} 
                                        style={[
                                            styles.heroSelectItem, 
                                            selectedHeroPathForBuy === h.id && { backgroundColor: theme.accent }
                                        ]}
                                        onPress={() => setSelectedHeroPathForBuy(h.id)}
                                    >
                                        <Text style={styles.heroSelectText}>{h.name} (الذهب: {h.wealth || 0})</Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={handleBuyItem}>
                                <Text style={styles.btnText}>تأكيد الشراء</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.btnText}>إلغاء</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingBottom: 20 },
    mainContainer: { gap: 12 },
    title: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
    catTrack: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
    catChip: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    catText: { fontSize: 9, color: '#fff', fontWeight: 'bold' },
    activeCatText: { color: '#fff' },
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20, marginTop: 10 },
    gridCell: { width: '30%', backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: '#d4af37', borderRadius: 8, padding: 8, alignItems: 'center', gap: 4 },
    cellImg: { width: 50, height: 50, borderRadius: 6 },
    cellName: { fontSize: 10, color: '#ffd700', fontWeight: 'bold', textAlign: 'center' },
    cellPrice: { fontSize: 9, color: '#f1c40f' },
    emptyText: { fontSize: 10, opacity: 0.6, color: '#fff', textAlign: 'center', padding: 20, width: '100%' },
    backBtn: { padding: 8, borderRadius: 6, marginBottom: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    detailsBox: { gap: 10 },
    detailsContent: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#d4af37', alignItems: 'center', gap: 8 },
    detailsImg: { width: 90, height: 90, borderRadius: 10, borderWidth: 2, borderColor: '#d4af37' },
    itemNameLarge: { fontSize: 14, fontWeight: 'bold' },
    itemPriceText: { fontSize: 11, color: '#f1c40f', fontWeight: 'bold' },
    itemCategoryText: { fontSize: 10, color: '#a4b0be' },
    statsBox: { backgroundColor: 'rgba(46, 213, 115, 0.1)', padding: 8, borderRadius: 6, width: '100%', alignItems: 'center', gap: 2 },
    statsBoxTitle: { fontSize: 9, fontWeight: 'bold', color: '#2ed573' },
    statsText: { fontSize: 9, color: '#2ed573', textAlign: 'center' },
    descText: { fontSize: 10, color: '#fff', textAlign: 'center', marginVertical: 4 },
    actionRow: { flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center', marginTop: 5 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { width: '85%', padding: 20, borderRadius: 12, borderWidth: 2, gap: 10 },
    modalTitle: { fontSize: 12, fontWeight: 'bold', color: '#ffd700', textAlign: 'center' },
    modalSearchInput: { borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 6, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 10 },
    heroSelectList: { maxHeight: 150, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 6 },
    heroSelectItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    heroSelectText: { color: '#fff', fontSize: 10 },
    modalBtnRow: { flexDirection: 'row', gap: 6, marginTop: 5 },
    modalBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
    closeModalBtn: { backgroundColor: '#555', padding: 6, borderRadius: 6, alignItems: 'center', marginTop: 4 }
});
