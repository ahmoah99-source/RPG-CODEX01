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
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 12,
        paddingBottom: 20,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    catTrack: {
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 2,
    },
    catChip: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    catText: {
        fontSize: 9,
        color: '#fff',
        fontWeight: 'bold',
    },
    activeCatText: {
        color: '#fff',
    },
    itemsGrid: {
        flexDirection: 'column',
        gap: 8,
        paddingBottom: 20,
    },
    emptyText: {
        fontSize: 10,
        opacity: 0.6,
        color: '#fff',
        textAlign: 'center',
        padding: 20,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        alignItems: 'center',
        gap: 10,
    },
    itemImg: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    itemInfo: {
        flex: 1,
        gap: 2,
    },
    itemName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    itemPrice: {
        fontSize: 9,
        color: '#f1c40f',
        fontWeight: 'bold',
    },
    itemDesc: {
        fontSize: 8,
        opacity: 0.7,
        color: '#ccc',
    },
    bonusRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 2,
    },
    bonusText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#2ed573',
    },
    buyBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buyBtnText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    }
});
