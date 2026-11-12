import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // 🌟 1. استيراد مكتبة اختيار الصور من الهاتف

export default function BackpackView({ codexEngine, heroId, theme, dict }) {
    const [selectedCategory, setSelectedCategory] = useState('الأسلحة');
    const [selectedSubCategory, setSelectedSubCategory] = useState('سيوف');
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const [globalQuery, setGlobalQuery] = useState('');

    // نوافذ الإدارة والتحكم (Modal)
    const [modalVisible, setModalVisible] = useState(false);
    const [heroSearchQuery, setHeroSearchQuery] = useState('');
    const [selectedHeroPathForEquip, setSelectedHeroPathForEquip] = useState('');

    // نافذة إضافة عنصر جديد
    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newBonusStr, setNewBonusStr] = useState('0');
    const [newBonusAgi, setNewBonusAgi] = useState('0');
    const [newBonusBody, setNewBonusBody] = useState('0');
    const [newBonusSpirit, setNewBonusSpirit] = useState('0');
    const [newItemImg, setNewItemImg] = useState('');
    const [imgSearchQuery, setImgSearchQuery] = useState('');

    const categories = codexEngine.getBackpackCategories() || {
        "الأسلحة": ["سيوف", "خناجر", "دروع", "فؤوس"],
        "الجرعات": ["إكسير الصحة", "إكسير المانا", "سموم"],
        "الملابس": ["خوذات", "دروع بدنية", "أحذية"]
    };
    
    const allItems = codexEngine.getData('backpack') || [];
    const rawHeroes = codexEngine.getData('heroes') || [];
    const imageFiles = codexEngine.getData('images') || [];

    // 🌟 2. دالة فتح معرض صور الهاتف لاختيار صورة العنصر
    const pickImageFromPhone = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            alert("⚠️ عذراً، يجب السماح للطبيق بالوصول للصور لاختيار صورة العنصر!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setNewItemImg(result.assets[0].uri);
        }
    };

    // فلترة العناصر
    const filteredItems = allItems.filter(item => 
        item.category === selectedCategory && (selectedSubCategory ? item.subCategory === selectedSubCategory : true)
    );

    const searchFilteredItems = allItems.filter(item => 
        item.name.toLowerCase().includes(globalQuery.toLowerCase())
    );

    const handleEquipAction = (actionType) => {
        if (!selectedHeroPathForEquip || !selectedItem) {
            alert("⚠️ برجاء اختيار بطل أولاً!");
            return;
        }
        if (actionType === 'equip') {
            const res = codexEngine.equipItemToHeroByPath(selectedHeroPathForEquip, selectedItem);
            alert(res.msg);
        } else {
            const res = codexEngine.unequipItemFromHeroByPath(selectedHeroPathForEquip, selectedItem.name);
            alert(res.msg);
        }
        setModalVisible(false);
    };

    const handleSaveNewItem = () => {
        if (!newItemName.trim()) {
            alert("⚠️ برجاء إدخال اسم العنصر!");
            return;
        }
        const itemData = {
            name: newItemName.trim(),
            category: selectedCategory,
            subCategory: selectedSubCategory || 'عام',
            desc: newItemDesc.trim(),
            img: newItemImg || "https://i.imgur.com/8Km9tLL.png",
            bonusStr: parseInt(newBonusStr) || 0,
            bonusAgi: parseInt(newBonusAgi) || 0,
            bonusBody: parseInt(newBonusBody) || 0,
            bonusSpirit: parseInt(newBonusSpirit) || 0
        };

        codexEngine.addBackpackItem(itemData);
        alert("✨ تم حفظ العنصر في الحقيبة بنجاح!");
        setAddItemModalVisible(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewBonusStr('0');
        setNewBonusAgi('0');
        setNewBonusBody('0');
        setNewBonusSpirit('0');
        setNewItemImg('');
    };

    return (
        <View style={styles.container}>
            {selectedItem ? (
                /* --- شاشة تفاصيل العنصر مع أزرار التعديل والحذف والارتداء --- */
                <View style={styles.detailsBox}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: theme.accent }]}
                        onPress={() => setSelectedItem(null)}
                    >
                        <Text style={styles.btnText}>⬅️ العودة للحقيبة</Text>
                    </TouchableOpacity>

                    <View style={styles.detailsContent}>
                        <Image source={{ uri: selectedItem.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.detailsImg} resizeMode="cover" />
                        <Text style={[styles.itemNameLarge, { color: theme.accent }]}>{selectedItem.name}</Text>
                        <Text style={styles.itemCategoryText}>التصنيف: {selectedItem.category} ➔ {selectedItem.subCategory}</Text>

                        <View style={styles.statsBox}>
                            <Text style={styles.statsBoxTitle}>الخصائص المكتسبة:</Text>
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
                                <Text style={styles.btnText}>⚔️ إدارة التجهيز (ارتداء/نزع)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: '#ff4757' }]}
                                onPress={() => {
                                    codexEngine.deleteBackpackItem(selectedItem.name);
                                    setSelectedItem(null);
                                    alert("🗑️ تم حذف العنصر بنجاح!");
                                }}
                            >
                                <Text style={styles.btnText}>🗑️ حذف</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : searchMode ? (
                /* --- شاشة البحث الشامل في الحقيبة --- */
                <View style={styles.searchContainer}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: '#3498db' }]}
                        onPress={() => setSearchMode(false)}
                    >
                        <Text style={styles.btnText}>⬅️ العودة للحقيبة والتصنيفات</Text>
                    </TouchableOpacity>

                    <TextInput 
                        style={[styles.searchInput, { color: theme.text, borderColor: theme.accent }]}
                        placeholder="🔍 ابحث عن أي عنصر في الحقيبة..."
                        placeholderTextColor="#a1a1aa"
                        value={globalQuery}
                        onChangeText={setGlobalQuery}
                    />

                    <ScrollView contentContainerStyle={styles.itemsGrid}>
                        {searchFilteredItems.map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.gridCell} onPress={() => setSelectedItem(item)}>
                                <Image source={{ uri: item.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.cellImg} resizeMode="cover" />
                                <Text style={styles.cellName} numberOfLines={1}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                /* --- الشاشة الرئيسية للحقيبة --- */
                <View style={styles.mainContainer}>
                    <Text style={[styles.title, { color: theme.accent }]}>🎒 حقيبة الظهر الأسطورية</Text>

                    {/* أزرار الإضافة والبحث الشامل */}
                    <View style={styles.topActionRow}>
                        <TouchableOpacity 
                            style={[styles.topActionBtn, { backgroundColor: '#2ed573' }]}
                            onPress={() => setAddItemModalVisible(true)}
                        >
                            <Text style={styles.btnText}>➕ إضافة عنصر جديد</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.topActionBtn, { backgroundColor: '#8e44ad' }]}
                            onPress={() => setSearchMode(true)}
                        >
                            <Text style={styles.btnText}>🔍 بحث شامل</Text>
                        </TouchableOpacity>
                    </View>

                    {/* سلايدر الفئات الرئيسية */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTrack}>
                        {Object.keys(categories).map((catName, idx) => (
                            <TouchableOpacity 
                                key={idx}
                                style={[styles.catChip, selectedCategory === catName && { backgroundColor: theme.accent }]}
                                onPress={() => {
                                    setSelectedCategory(catName);
                                    const subs = categories[catName] || [];
                                    setSelectedSubCategory(subs[0] || '');
                                }}
                            >
                                <Text style={[styles.catText, selectedCategory === catName && styles.activeCatText]}>{catName}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* سلايدر الفئات الفرعية */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catTrack}>
                        {(categories[selectedCategory] || []).map((subCat, idx) => (
                            <TouchableOpacity 
                                key={idx}
                                style={[styles.catChip, selectedSubCategory === subCat && { backgroundColor: theme.accent }]}
                                onPress={() => setSelectedSubCategory(subCat)}
                            >
                                <Text style={[styles.catText, selectedSubCategory === subCat && styles.activeCatText]}>{subCat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* شبكة العناصر */}
                    <ScrollView contentContainerStyle={styles.itemsGrid}>
                        {filteredItems.length === 0 ? (
                            <Text style={styles.emptyText}>لا توجد عناصر في هذا التصنيف الفرعي حالياً.</Text>
                        ) : (
                            filteredItems.map((item, idx) => (
                                <TouchableOpacity key={idx} style={styles.gridCell} onPress={() => setSelectedItem(item)}>
                                    <Image source={{ uri: item.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.cellImg} resizeMode="cover" />
                                    <Text style={styles.cellName} numberOfLines={1}>{item.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
            )}

            {/* --- نافذة إضافة عنصر جديد للحقيبة (مع زرار اختيار صورة من الهاتف) --- */}
            <Modal visible={addItemModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>➕ إضافة عنصر جديد إلى الحقيبة</Text>
                        
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="اسم العنصر..."
                            placeholderTextColor="#a1a1aa"
                            value={newItemName}
                            onChangeText={setNewItemName}
                        />

                        <TextInput 
                            style={[styles.modalInput, { height: 60 }]}
                            placeholder="وصف العنصر..."
                            placeholderTextColor="#a1a1aa"
                            multiline
                            value={newItemDesc}
                            onChangeText={setNewItemDesc}
                        />

                        <Text style={styles.subLabel}>مكافآت الإحصائيات:</Text>
                        <View style={styles.statsInputRow}>
                            <TextInput style={styles.statInput} placeholder="STR" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusStr} onChangeText={setNewBonusStr} />
                            <TextInput style={styles.statInput} placeholder="AGI" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusAgi} onChangeText={setNewBonusAgi} />
                            <TextInput style={styles.statInput} placeholder="BODY" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusBody} onChangeText={setNewBonusBody} />
                            <TextInput style={styles.statInput} placeholder="SPIRIT" placeholderTextColor="#aaa" keyboardType="numeric" value={newBonusSpirit} onChangeText={setNewBonusSpirit} />
                        </View>

                        {/* 🌟 زرار اختيار الصورة من معرض الهاتف وعرض معاينة لها */}
                        <Text style={styles.subLabel}>صورة العنصر:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <TouchableOpacity 
                                style={[styles.pickImgBtn, { backgroundColor: theme.accent }]}
                                onPress={pickImageFromPhone}
                            >
                                <Text style={styles.btnText}>📁 اختر صورة من الهاتف</Text>
                            </TouchableOpacity>
                            {newItemImg ? (
                                <Image source={{ uri: newItemImg }} style={{ width: 45, height: 45, borderRadius: 6, borderWidth: 1, borderColor: '#2ed573' }} />
                            ) : (
                                <Text style={{ fontSize: 9, color: '#a4b0be' }}>لم يتم اختيار صورة</Text>
                            )}
                        </View>

                        {/* خيار الصور الافتراضية القديمة أيضاً إن أراد المستخدم */}
                        <TextInput 
                            style={styles.modalSearchInput}
                            placeholder="أو ابحث في الصور الجاهزة..."
                            placeholderTextColor="#a1a1aa"
                            value={imgSearchQuery}
                            onChangeText={setImgSearchQuery}
                        />
                        <ScrollView horizontal style={{ maxHeight: 50 }}>
                            {imageFiles
                                .filter(img => img.name.toLowerCase().includes(imgSearchQuery.toLowerCase()))
                                .map((imgFile, i) => (
                                    <TouchableOpacity 
                                        key={i} 
                                        style={[styles.imgSelectItem, newItemImg === imgFile.uri && { borderColor: '#2ed573', borderWidth: 2 }]}
                                        onPress={() => setNewItemImg(imgFile.uri)}
                                    >
                                        <Image source={{ uri: imgFile.uri }} style={{ width: 40, height: 40, borderRadius: 4 }} />
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={handleSaveNewItem}>
                                <Text style={styles.btnText}>حفظ العنصر</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ff4757' }]} onPress={() => setAddItemModalVisible(false)}>
                                <Text style={styles.btnText}>إلغاء</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* --- نافذة اختيار البطل لارتداء أو نزع العتاد --- */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>⚔️ إدارة التجهيز لـ ({selectedItem?.name})</Text>
                        
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
                                            selectedHeroPathForEquip === h.id && { backgroundColor: theme.accent }
                                        ]}
                                        onPress={() => setSelectedHeroPathForEquip(h.id)}
                                    >
                                        <Text style={styles.heroSelectText}>{h.name} (Level {h.level})</Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={() => handleEquipAction('equip')}>
                                <Text style={styles.btnText}>ارتداء للبطل</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ff4757' }]} onPress={() => handleEquipAction('unequip')}>
                                <Text style={styles.btnText}>نزع من البطل</Text>
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
    mainContainer: { gap: 10 },
    title: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
    topActionRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    topActionBtn: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
    catTrack: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
    catChip: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    catText: { fontSize: 9, color: '#fff', fontWeight: 'bold' },
    activeCatText: { color: '#fff' },
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20, marginTop: 10 },
    gridCell: { width: '30%', backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: '#d4af37', borderRadius: 8, padding: 8, alignItems: 'center', gap: 5 },
    cellImg: { width: 50, height: 50, borderRadius: 6 },
    cellName: { fontSize: 10, color: '#ffd700', fontWeight: 'bold', textAlign: 'center' },
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
    actionButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
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
    pickImgBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
    imgSelectItem: { marginRight: 6, padding: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    heroSelectList: { maxHeight: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 6 },
    heroSelectItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    heroSelectText: { color: '#fff', fontSize: 10 },
    modalBtnRow: { flexDirection: 'row', gap: 6, marginTop: 5 },
    modalBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
    closeModalBtn: { backgroundColor: '#555', padding: 6, borderRadius: 6, alignItems: 'center', marginTop: 4 }
});
