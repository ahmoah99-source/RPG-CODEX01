import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function SkillsView({ codexEngine, heroId, theme, dict }) {
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const categories = codexEngine.getSkillCategories();
    const allSkills = codexEngine.getData('skills');

    const filteredSkills = selectedCategory === 'الكل' 
        ? allSkills 
        : allSkills.filter(skill => skill.category === selectedCategory);

    const handleEquip = (skillName) => {
        if (!heroId) {
            alert("⚠️ برجاء اختيار بطل أولاً من الشاشة الرئيسية أو قائمة الأبطال!");
            return;
        }
        const success = codexEngine.equipSkillToHero(heroId, skillName);
        if (success) {
            alert("✨ تم تجهيز المهارة للبطل بنجاح!");
        } else {
            alert("⚠️ المهارة مجهزة بالفعل لهذا البطل أو حدث خطأ.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.accent }]}>⚡ شجرة المهارات والمواهب</Text>

            {/* سلايدر فئات المهارات */}
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

            {/* قائمة المهارات */}
            <ScrollView contentContainerStyle={styles.itemsGrid}>
                {filteredSkills.length === 0 ? (
                    <Text style={styles.emptyText}>لا توجد مهارات في هذا التصنيف حالياً.</Text>
                ) : (
                    filteredSkills.map((skill, idx) => (
                        <View key={idx} style={styles.itemCard}>
                            <Image source={{ uri: skill.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.itemImg} resizeMode="cover" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{skill.name}</Text>
                                <Text style={styles.itemDesc} numberOfLines={2}>{skill.desc}</Text>
                                <View style={styles.bonusRow}>
                                    {skill.bonusStr > 0 && <Text style={styles.bonusText}>ق:+{skill.bonusStr}</Text>}
                                    {skill.bonusAgi > 0 && <Text style={styles.bonusText}>ر:+{skill.bonusAgi}</Text>}
                                    {skill.bonusBody > 0 && <Text style={styles.bonusText}>ج:+{skill.bonusBody}</Text>}
                                    {skill.bonusSpirit > 0 && <Text style={styles.bonusText}>رة:+{skill.bonusSpirit}</Text>}
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={[styles.equipBtn, { backgroundColor: theme.accent }]}
                                onPress={() => handleEquip(skill.name)}
                            >
                                <Text style={styles.equipBtnText}>تجهيز</Text>
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
    equipBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    equipBtnText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    }
});
