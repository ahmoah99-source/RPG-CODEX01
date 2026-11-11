import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';

export default function SkillsView({ codexEngine, heroId, theme, dict }) {
    const [selectedCategory, setSelectedCategory] = useState('الكل');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [globalQuery, setGlobalQuery] = useState('');

    // نافذة تجهيز المهارة للبطل
    const [modalVisible, setModalVisible] = useState(false);
    const [heroSearchQuery, setHeroSearchQuery] = useState('');
    const [selectedHeroPathForSkill, setSelectedHeroPathForSkill] = useState('');

    // نافذة إضافة مهارة جديدة
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillDesc, setNewSkillDesc] = useState('');
    const [newBonusStr, setNewBonusStr] = useState('0');
    const [newBonusAgi, setNewBonusAgi] = useState('0');
    const [newBonusBody, setNewBonusBody] = useState('0');
    const [newBonusSpirit, setNewBonusSpirit] = useState('0');
    const [newSkillImg, setNewSkillImg] = useState('');
    const [imgSearchQuery, setImgSearchQuery] = useState('');

    const categories = codexEngine.getSkillCategories();
    const allSkills = codexEngine.getData('skills');
    const rawHeroes = codexEngine.getData('heroes') || [];
    const imageFiles = codexEngine.getData('images') || []; // قائمة الصور المتاحة في النظام

    const filteredSkills = selectedCategory === 'الكل' 
        ? allSkills 
        : allSkills.filter(skill => skill.category === selectedCategory);

    const searchFilteredSkills = allSkills.filter(skill => 
        skill.name.toLowerCase().includes(globalQuery.toLowerCase())
    );

    const handleEquipSkill = () => {
        if (!selectedHeroPathForSkill || !selectedSkill) {
            alert("⚠️ برجاء اختيار بطل أولاً!");
            return;
        }
        const success = codexEngine.equipSkillToHeroByPath(selectedHeroPathForSkill, selectedSkill.name);
        if (success) {
            alert("✨ تم تجهيز المهارة للبطل بنجاح!");
            setModalVisible(false);
        } else {
            alert("⚠️ المهارة مجهزة بالفعل لهذا البطل أو حدث خطأ.");
        }
    };

    const handleSaveNewSkill = () => {
        if (!newSkillName.trim()) {
            alert("⚠️ برجاء إدخال اسم المهارة!");
            return;
        }
        const skillData = {
            name: newSkillName.trim(),
            category: selectedCategory === 'الكل' ? 'القدرات الهجومية' : selectedCategory,
            desc: newSkillDesc.trim(),
            img: newSkillImg,
            bonusStr: parseInt(newBonusStr) || 0,
            bonusAgi: parseInt(newBonusAgi) || 0,
            bonusBody: parseInt(newBonusBody) || 0,
            bonusSpirit: parseInt(newBonusSpirit) || 0
        };

        codexEngine.addSkill(skillData);
        alert("✨ تم حفظ المهارة الجديدة بنجاح!");
        setAddModalVisible(false);
        // تصفير الحقول
        setNewSkillName('');
        setNewSkillDesc('');
        setNewBonusStr('0');
        setNewBonusAgi('0');
        setNewBonusBody('0');
        setNewBonusSpirit('0');
        setNewSkillImg('');
    };

    return (
        <View style={styles.container}>
            {selectedSkill ? (
                <View style={styles.detailsBox}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: theme.accent }]}
                        onPress={() => setSelectedSkill(null)}
                    >
                        <Text style={styles.btnText}>⬅️ العودة لقائمة المهارات</Text>
                    </TouchableOpacity>

                    <View style={styles.detailsContent}>
                        <Image source={{ uri: selectedSkill.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.detailsImg} resizeMode="cover" />
                        <Text style={[styles.itemNameLarge, { color: theme.accent }]}>{selectedSkill.name}</Text>
                        <Text style={styles.itemCategoryText}>التصنيف: {selectedSkill.category}</Text>

                        <View style={styles.statsBox}>
                            <Text style={styles.statsBoxTitle}>مكافآت المهارة:</Text>
                            <Text style={styles.statsText}>
                                القوة +{selectedSkill.bonusStr} | الرشاقة +{selectedSkill.bonusAgi} | الجسد +{selectedSkill.bonusBody} | الروح +{selectedSkill.bonusSpirit}
                            </Text>
                        </View>

                        <Text style={styles.descText}>{selectedSkill.desc || "لا يوجد وصف للمهارة."}</Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: '#2ed573' }]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.btnText}>⚡ تجهيز للبطل</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : searchMode ? (
                <View style={styles.searchContainer}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: '#3498db' }]}
                        onPress={() => setSearchMode(false)}
                    >
                        <Text style={styles.btnText}>⬅️ العودة لقائمة المهارات</Text>
                    </TouchableOpacity>

                    <TextInput 
                        style={[styles.searchInput, { color: theme.text, borderColor: theme.accent }]}
                        placeholder="🔍 ابحث عن أي مهارة..."
                        placeholderTextColor="#a1a1aa"
                        value={globalQuery}
                        onChangeText={setGlobalQuery}
                    />

                    <ScrollView contentContainerStyle={styles.itemsGrid}>
                        {searchFilteredSkills.map((skill, idx) => (
                            <TouchableOpacity key={idx} style={styles.gridCell} onPress={() => setSelectedSkill(skill)}>
                                <Image source={{ uri: skill.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.cellImg} resizeMode="cover" />
                                <Text style={styles.cellName} numberOfLines={1}>{skill.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.mainContainer}>
                    <Text style={[styles.title, { color: theme.accent }]}>⚡ شجرة المهارات والمواهب الأسطورية</Text>

                    {/* أزرار الإضافات والبحث الشامل */}
                    <View style={styles.topActionRow}>
                        <TouchableOpacity 
                            style={[styles.topActionBtn, { backgroundColor: '#2ed573' }]}
                            onPress={() => setAddModalVisible(true)}
                        >
                            <Text style={styles.btnText}>➕ إضافة مهارة جديدة</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.topActionBtn, { backgroundColor: '#8e44ad' }]}
                            onPress={() => setSearchMode(true)}
                        >
                            <Text style={styles.btnText}>🔍 بحث شامل</Text>
                        </TouchableOpacity>
                    </View>

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

                    {/* شبكة المهارات */}
                    <ScrollView contentContainerStyle={styles.itemsGrid}>
                        {filteredSkills.length === 0 ? (
                            <Text style={styles.emptyText}>لا توجد مهارات في هذا التصنيف حالياً.</Text>
                        ) : (
                            filteredSkills.map((skill, idx) => (
                                <TouchableOpacity key={idx} style={styles.gridCell} onPress={() => setSelectedSkill(skill)}>
                                    <Image source={{ uri: skill.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.cellImg} resizeMode="cover" />
                                    <Text style={styles.cellName} numberOfLines={1}>{skill.name}</Text>
                                    <Text style={styles.cellSub}>⚡ مهارة</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
            )}

            {/* نافذة منبثقة (Modal) لإضافة مهارة جديدة مع اختيار الصورة والإحصائيات */}
            <Modal visible={addModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>➕ إضافة مهارة أو موهبة أسطورية</Text>
                        
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="أدخل اسم المهارة..."
                            placeholderTextColor="#a1a1aa"
                            value={newSkillName}
                            onChangeText={setNewSkillName}
                        />

                        <TextInput 
                            style={[styles.modalInput, { height: 60 }]}
                            placeholder="أدخل وصف المهارة..."
                            placeholderTextColor="#a1a1aa"
                            multiline={true}
                            value={newSkillDesc}
                            onChangeText={setNewSkillDesc}
                        />

                        <Text style={styles.subLabel}>مكافآت الإحصائيات:</Text>
                        <View style={styles.statsInputRow}>
                            <TextInput style={styles.statInput} placeholder="قوة STR" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusStr} onChangeText={setNewBonusStr} />
                            <TextInput style={styles.statInput} placeholder="رشاقة AGI" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusAgi} onChangeText={setNewBonusAgi} />
                            <TextInput style={styles.statInput} placeholder="جسد BODY" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusBody} onChangeText={setNewBonusBody} />
                            <TextInput style={styles.statInput} placeholder="روح SPIRIT" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusSpirit} onChangeText={setNewBonusSpirit} />
                        </View>

                        <Text style={styles.subLabel}>اختر صورة المهارة:</Text>
                        <TextInput 
                            style={styles.modalSearchInput}
                            placeholder="🔍 ابحث عن اسم الصورة..."
                            placeholderTextColor="#a1a1aa"
                            value={imgSearchQuery}
                            onChangeText={setImgSearchQuery}
                        />
                        <ScrollView style={styles.imgSelectList} horizontal>
                            {imageFiles
                                .filter(img => img.name.toLowerCase().includes(imgSearchQuery.toLowerCase()))
                                .map((imgFile, i) => (
                                    <TouchableOpacity 
                                        key={i} 
                                        style={[styles.imgSelectItem, newSkillImg === imgFile.uri && { borderColor: '#2ed573', borderWidth: 2 }]}
                                        onPress={() => setNewSkillImg(imgFile.uri)}
                                    >
                                        <Image source={{ uri: imgFile.uri }} style={{ width: 40, height: 40, borderRadius: 4 }} />
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={handleSaveNewSkill}>
                                <Text style={styles.btnText}>حفظ المهارة</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ff4757' }]} onPress={() => setAddModalVisible(false)}>
                                <Text style={styles.btnText}>إلغاء</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* نافذة منبثقة (Modal) لاختيار البطل لتجهيز المهارة له */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>🛡️ اختر البطل لتجهيز المهارة له ({selectedSkill?.name})</Text>
                        
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
                                            selectedHeroPathForSkill === h.id && { backgroundColor: theme.accent }
                                        ]}
                                        onPress={() => setSelectedHeroPathForSkill(h.id)}
                                    >
                                        <Text style={styles.heroSelectText}>{h.name} (Level {h.level})</Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={handleEquipSkill}>
                                <Text style={styles.btnText}>تأكيد التجهيز</Text>
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
    topActionRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    topActionBtn: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
    catTrack: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
    catChip: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    catText: { fontSize: 9, color: '#fff', fontWeight: 'bold' },
    activeCatText: { color: '#fff' },
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20, marginTop: 10 },
    gridCell: { width: '30%', backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: '#d4af37', borderRadius: 8, padding: 8, alignItems: 'center', gap: 4 },
    cellImg: { width: 50, height: 50, borderRadius: 6 },
    cellName: { fontSize: 10, color: '#ffd700', fontWeight: 'bold', textAlign: 'center' },
    cellSub: { fontSize: 8, color: '#2ed573' },
    emptyText: { fontSize: 10, opacity: 0.6, color: '#fff', textAlign: 'center', padding: 20, width: '100%' },
    backBtn: { padding: 8, borderRadius: 6, marginBottom: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    detailsBox: { gap: 10 },
    detailsContent: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#d4af37', alignItems: 'center', gap: 8 },
    detailsImg: { width: 90, height: 90, borderRadius: 10, borderWidth: 2, borderColor: '#d4af37' },
    itemNameLarge: { fontSize: 14, fontWeight: 'bold' },
    itemCategoryText: { fontSize: 10, color: '#a4b0be' },
    statsBox: { backgroundColor: 'rgba(46, 213, 115, 0.1)', padding: 8, borderRadius: 6, width: '100%', alignItems: 'center', gap: 2 },
    statsBoxTitle: { fontSize: 9, fontWeight: 'bold', color: '#2ed573' },
    statsText: { fontSize: 9, color: '#2ed573', textAlign: 'center' },
    descText: { fontSize: 10, color: '#fff', textAlign: 'center', marginVertical: 4 },
    actionRow: { flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center', marginTop: 5 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    searchContainer: { gap: 10 },
    searchInput: { borderWidth: 1, borderRadius: 8, padding: 8, fontSize: 11, backgroundColor: 'rgba(255,255,255,0.05)' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { width: '85%', padding: 20, borderRadius: 12, borderWidth: 2, gap: 10, maxHeight: '80%' },
    modalTitle: { fontSize: 12, fontWeight: 'bold', color: '#ffd700', textAlign: 'center', marginBottom: 5 },
    modalInput: { borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 6, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 10, marginBottom: 6 },
    subLabel: { fontSize: 10, fontWeight: 'bold', color: '#a4b0be', marginTop: 4 },
    statsInputRow: { flexDirection: 'row', gap: 4, marginBottom: 6 },
    statInput: { flex: 1, borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 4, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 9, textAlign: 'center' },
    modalSearchInput: { borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 6, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 10, marginBottom: 4 },
    imgSelectList: { maxHeight: 50, marginBottom: 6 },
    imgSelectItem: { marginRight: 6, padding: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    heroSelectList: { maxHeight: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 6 },
    heroSelectItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    heroSelectText: { color: '#fff', fontSize: 10 },
    modalBtnRow: { flexDirection: 'row', gap: 6, marginTop: 5 },
    modalBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
    closeModalBtn: { backgroundColor: '#555', padding: 6, borderRadius: 6, alignItems: 'center', marginTop: 4 }
});
