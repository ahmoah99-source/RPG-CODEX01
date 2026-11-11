import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';

export default function LevelsView({ codexEngine, heroId, theme, dict }) {
    // جلب بيانات أنظمة وقوة ومستويات الطاقة من المحرك
    const systemsData = codexEngine.getData('energySystems') || {};
    const systemNames = Object.keys(systemsData);
    
    const [selectedSys, setSelectedSys] = useState(systemNames[0] || '');
    const currentSysObj = systemsData[selectedSys] || { categories: {}, systemImg: "" };
    
    const categoryNames = Object.keys(currentSysObj.categories || {});
    const [selectedCat, setSelectedCat] = useState(categoryNames[0] || '');
    
    const currentCatObj = currentSysObj.categories[selectedCat] || { levels: {} };
    const levelNames = Object.keys(currentCatObj.levels || {});
    const [selectedLevelName, setSelectedLevelName] = useState(levelNames[0] || '');

    // نوافذ الإدارة والتحكم المنبثقة (Modals)
    const [modalType, setModalType] = useState(null); // 'addSys', 'editSys', 'addCat', 'editCat', 'addLevel', 'editLevel', 'imagePicker'
    const [inputVal1, setInputVal1] = useState('');
    const [inputVal2, setInputVal2] = useState('');
    const [inputVal3, setInputVal3] = useState('');
    const [inputVal4, setInputVal4] = useState('');
    const [selectedImgPath, setSelectedImgPath] = useState('');
    const [imgSearchQuery, setImgSearchQuery] = useState('');

    const imageFiles = codexEngine.getData('images') || [];
    const activeLevelData = currentCatObj.levels[selectedLevelName] || null;

    // دوال الحفظ والتعديل عبر محرك التطبيق
    const handleSaveModal = () => {
        if (modalType === 'addSys') {
            if (!inputVal1.trim()) return alert("⚠️ أخل اسم النظام!");
            codexEngine.addEnergySystem(inputVal1.trim(), selectedImgPath);
            setSelectedSys(inputVal1.trim());
        } else if (modalType === 'editSys') {
            if (!inputVal1.trim()) return alert("⚠️ أدخل الاسم الجديد!");
            codexEngine.renameEnergySystem(selectedSys, inputVal1.trim());
            setSelectedSys(inputVal1.trim());
        } else if (modalType === 'addCat') {
            if (!inputVal1.trim()) return alert("⚠️ أدخل اسم الفئة!");
            codexEngine.addEnergyCategory(selectedSys, inputVal1.trim());
            setSelectedCat(inputVal1.trim());
        } else if (modalType === 'editCat') {
            if (!inputVal1.trim()) return alert("⚠️ أدخل اسم الفئة الجديد!");
            codexEngine.renameEnergyCategory(selectedSys, selectedCat, inputVal1.trim());
            setSelectedCat(inputVal1.trim());
        } else if (modalType === 'addLevel') {
            if (!inputVal1.trim()) return alert("⚠️ أدخل اسم المستوى!");
            const levelObj = { age: inputVal2, power: inputVal3, desc: inputVal4, img: selectedImgPath };
            codexEngine.addEnergyLevel(selectedSys, selectedCat, inputVal1.trim(), levelObj);
            setSelectedLevelName(inputVal1.trim());
        } else if (modalType === 'editLevel') {
            const levelObj = { age: inputVal2, power: inputVal3, desc: inputVal4, img: selectedImgPath };
            codexEngine.updateEnergyLevel(selectedSys, selectedCat, selectedLevelName, levelObj);
        } else if (modalType === 'editSysImg') {
            codexEngine.updateSystemImage(selectedSys, selectedImgPath);
        }
        setModalType(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.title, { color: theme.accent }]}>⚡ لوحة إدارة أنظمة ومستويات القوة</Text>

            {/* --- قسم 1: نظام الطاقة --- */}
            <View style={styles.sectionBox}>
                <View style={styles.rowBetween}>
                    <Text style={styles.sectionLabel}>🔮 نظام الطاقة النشط:</Text>
                    <Image source={{ uri: currentSysObj.systemImg || "https://i.imgur.com/8Km9tLL.png" }} style={styles.sysImageThumb} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipTrack}>
                    {systemNames.map((sys, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            style={[styles.chip, selectedSys === sys && { backgroundColor: theme.accent }]}
                            onPress={() => {
                                setSelectedSys(sys);
                                const cats = Object.keys(systemsData[sys]?.categories || {});
                                setSelectedCat(cats[0] || '');
                                const lvls = Object.keys(systemsData[sys]?.categories[cats[0]]?.levels || {});
                                setSelectedLevelName(lvls[0] || '');
                            }}
                        >
                            <Text style={styles.chipText}>{sys}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2ed573' }]} onPress={() => { setModalType('addSys'); setInputVal1(''); setSelectedImgPath(''); }}>
                        <Text style={styles.btnText}>➕ إضافة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3498db' }]} onPress={() => { setModalType('editSysImg'); setSelectedImgPath(currentSysObj.systemImg); }}>
                        <Text style={styles.btnText}>🖼️ الصورة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f1c40f' }]} onPress={() => { setModalType('editSys'); setInputVal1(selectedSys); }}>
                        <Text style={styles.btnText}>✏️ الاسم</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ff4757' }]} onPress={() => { codexEngine.deleteEnergySystem(selectedSys); }}>
                        <Text style={styles.btnText}>🗑️ حذف</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- قسم 2: الفئات --- */}
            <View style={styles.sectionBox}>
                <Text style={styles.sectionLabel}>📁 الفئة النشطة:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipTrack}>
                    {categoryNames.map((cat, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            style={[styles.chip, selectedCat === cat && { backgroundColor: theme.accent }]}
                            onPress={() => {
                                setSelectedCat(cat);
                                const lvls = Object.keys(currentSysObj.categories[cat]?.levels || {});
                                setSelectedLevelName(lvls[0] || '');
                            }}
                        >
                            <Text style={styles.chipText}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#8e44ad' }]} onPress={() => { setModalType('addCat'); setInputVal1(''); }}>
                        <Text style={styles.btnText}>➕ إضافة فئة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f1c40f' }]} onPress={() => { setModalType('editCat'); setInputVal1(selectedCat); }}>
                        <Text style={styles.btnText}>✏️ تعديل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ff4757' }]} onPress={() => { codexEngine.deleteEnergyCategory(selectedSys, selectedCat); }}>
                        <Text style={styles.btnText}>🗑️ حذف</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- قسم 3: المستويات --- */}
            <View style={styles.sectionBox}>
                <Text style={styles.sectionLabel}>⭐ المستوى النشط:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipTrack}>
                    {levelNames.map((lvl, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            style={[styles.chip, selectedLevelName === lvl && { backgroundColor: theme.accent }]}
                            onPress={() => setSelectedLevelName(lvl)}
                        >
                            <Text style={styles.chipText}>{lvl}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3498db' }]} onPress={() => { setModalType('addLevel'); setInputVal1(''); setInputVal2(''); setInputVal3(''); setInputVal4(''); setSelectedImgPath(''); }}>
                        <Text style={styles.btnText}>➕ إضافة مستوى</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f1c40f' }]} onPress={() => { 
                        if (!activeLevelData) return;
                        setModalType('editLevel');
                        setInputVal1(selectedLevelName);
                        setInputVal2(activeLevelData.age);
                        setInputVal3(activeLevelData.power);
                        setInputVal4(activeLevelData.desc);
                        setSelectedImgPath(activeLevelData.img);
                    }}>
                        <Text style={styles.btnText}>✏️ تعديل تفاصيل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ff4757' }]} onPress={() => { codexEngine.deleteEnergyLevel(selectedSys, selectedCat, selectedLevelName); }}>
                        <Text style={styles.btnText}>🗑️ حذف</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- قسم 4: بطاقة تفاصيل المستوى النشط --- */}
            <View style={styles.detailsBox}>
                <Text style={styles.pathInfo}>📌 النظام: {selectedSys} ➔ {selectedCat}</Text>
                <Text style={[styles.subTitle, { color: theme.accent }]}>{selectedLevelName || "اختر أو أنشئ مستوى"}</Text>

                {activeLevelData ? (
                    <View style={styles.levelCardContent}>
                        <Image source={{ uri: activeLevelData.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.levelImgLarge} resizeMode="cover" />
                        
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>⏳ العمر المتوقع: <Text style={{ color: '#ffd700', fontWeight: 'bold' }}>{activeLevelData.age || "غير محدد"}</Text></Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>💪 مقدار القوة: <Text style={{ color: '#2ed573', fontWeight: 'bold' }}>{activeLevelData.power || "0"}</Text></Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>📜 الوصف: <Text style={{ color: '#fff' }}>{activeLevelData.desc || "لا يوجد وصف."}</Text></Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>لا توجد تفاصيل معروضة. الرجاء اختيار مستوى.</Text>
                )}
            </View>

            {/* --- نوافذ الإدخال المنبثقة (Modals) --- */}
            <Modal visible={modalType !== null} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: '#1e1e2f', borderColor: theme.accent }]}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'addSys' && '➕ إضافة نظام طاقة جديد'}
                            {modalType === 'editSys' && '✏️ تعديل اسم النظام'}
                            {modalType === 'editSysImg' && '🖼️ تغيير صورة النظام'}
                            {modalType === 'addCat' && '➕ إضافة فئة جديدة'}
                            {modalType === 'editCat' && '✏️ تعديل اسم الفئة'}
                            {modalType === 'addLevel' && '➕ إضافة مستوى جديد'}
                            {modalType === 'editLevel' && '✏️ تعديل تفاصيل المستوى'}
                        </Text>

                        {(modalType === 'addSys' || modalType === 'editSys' || modalType === 'addCat' || modalType === 'editCat' || modalType === 'addLevel') && (
                            <TextInput 
                                style={styles.modalInput} 
                                placeholder="الاسم..." 
                                placeholderTextColor="#a1a1aa" 
                                value={inputVal1} 
                                onChangeText={setInputVal1} 
                            />
                        )}

                        {modalType === 'addLevel' && (
                            <TextInput 
                                style={styles.modalInput} 
                                placeholder="اسم المستوى الجديد..." 
                                placeholderTextColor="#a1a1aa" 
                                value={inputVal1} 
                                onChangeText={setInputVal1} 
                            />
                        )}

                        {(modalType === 'addLevel' || modalType === 'editLevel') && (
                            <>
                                <TextInput style={styles.modalInput} placeholder="العمر المتوقع / مدة النشاط" placeholderTextColor="#a1a1aa" value={inputVal2} onChangeText={setInputVal2} />
                                <TextInput style={styles.modalInput} placeholder="مقدار القوة (المضاعف)" placeholderTextColor="#a1a1aa" keyboardType="numeric" value={inputVal3} onChangeText={setInputVal3} />
                                <TextInput style={[styles.modalInput, { height: 50 }]} placeholder="الوصف" placeholderTextColor="#a1a1aa" multiline value={inputVal4} onChangeText={setInputVal4} />
                            </>
                        )}

                        {/* اختيار الصورة */}
                        {(modalType === 'addSys' || modalType === 'editSysImg' || modalType === 'addLevel' || modalType === 'editLevel') && (
                            <View style={{ width: '100%', marginVertical: 6 }}>
                                <Text style={{ color: '#a4b0be', fontSize: 10, marginBottom: 4 }}>اختر صورة توضيحية:</Text>
                                <TextInput 
                                    style={styles.modalSearchInput}
                                    placeholder="🔍 ابحث عن اسم الصورة..."
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
                                                style={[styles.imgSelectItem, selectedImgPath === imgFile.uri && { borderColor: '#2ed573', borderWidth: 2 }]}
                                                onPress={() => setSelectedImgPath(imgFile.uri)}
                                            >
                                                <Image source={{ uri: imgFile.uri }} style={{ width: 40, height: 40, borderRadius: 4 }} />
                                            </TouchableOpacity>
                                        ))}
                                </ScrollView>
                            </View>
                        )}

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2ed573' }]} onPress={handleSaveModal}>
                                <Text style={styles.btnText}>حفظ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ff4757' }]} onPress={() => setModalType(null)}>
                                <Text style={styles.btnText}>إلغاء</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: 'linear-gradient(135deg, #1e1e2f, #2a2a40)' },
    title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    sectionBox: { backgroundColor: 'rgba(0,0,0,0.25)', padding: 8, borderRadius: 6, marginBottom: 8 },
    sectionLabel: { fontSize: 11, color: '#ffd700', fontWeight: 'bold', marginBottom: 4 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    sysImageThumb: { width: 28, height: 28, borderRadius: 4, borderWidth: 1, borderColor: '#ffd700' },
    chipTrack: { flexDirection: 'row', gap: 6, paddingVertical: 4 },
    chip: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    chipText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
    btnRow: { flexDirection: 'row', gap: 4, marginTop: 6 },
    actionBtn: { flex: 1, paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
    btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    detailsBox: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d4af37', alignItems: 'center', marginBottom: 20 },
    pathInfo: { fontSize: 10, color: '#a4b0be', marginBottom: 2 },
    subTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    levelCardContent: { width: '100%', alignItems: 'center', gap: 6 },
    levelImgLarge: { width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderColor: '#d4af37', marginBottom: 4 },
    detailRow: { backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', padding: 6, borderRadius: 6 },
    detailText: { fontSize: 10, color: '#fff' },
    emptyText: { fontSize: 10, opacity: 0.6, color: '#fff', textAlign: 'center', padding: 10 },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { width: '85%', padding: 15, borderRadius: 10, borderWidth: 2, gap: 8 },
    modalTitle: { fontSize: 12, fontWeight: 'bold', color: '#ffd700', textAlign: 'center' },
    modalInput: { borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 6, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 10 },
    modalSearchInput: { borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, padding: 5, color: '#ffd700', backgroundColor: '#2a2a40', fontSize: 9, marginBottom: 4 },
    imgSelectItem: { marginRight: 6, padding: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    modalBtnRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
    modalBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' }
});
