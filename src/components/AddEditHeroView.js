import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // 🌟 1. استيراد مكتبة اختيار الصور من الهاتف

export default function AddEditHeroView({ codexEngine, heroId, theme, dict, onNavigate }) {
    const isEdit = Boolean(heroId);
    const existingHero = isEdit ? codexEngine.getHeroData(heroId) : null;

    const [heroName, setHeroName] = useState(existingHero ? existingHero.name : '');
    const [strength, setStrength] = useState(existingHero ? existingHero.strength : 10);
    const [agility, setAgility] = useState(existingHero ? existingHero.agility : 10);
    const [body, setBody] = useState(existingHero ? existingHero.body : 5);
    const [spirit, setSpirit] = useState(existingHero ? existingHero.spirit : 5);
    const [level, setLevel] = useState(existingHero ? existingHero.level : 1);
    const [hp, setHp] = useState(existingHero ? existingHero.hp : 100);
    const [maxHp, setMaxHp] = useState(existingHero ? existingHero.maxHp : 100);
    const [mp, setMp] = useState(existingHero ? existingHero.mp : 50);
    const [maxMp, setMaxMp] = useState(existingHero ? existingHero.maxMp : 50);
    const [wealth, setWealth] = useState(existingHero ? existingHero.wealth : 100);
    const [selectedAvatar, setSelectedAvatar] = useState(existingHero ? (existingHero.avatarPath || existingHero.imgSrc) : '');
    const [imgSearch, setImgSearch] = useState('');

    const imageFiles = codexEngine.getData('images') || [];

    // 🌟 2. دالة فتح معرض صور الهاتف لاختيار صورة البطل
    const pickImageFromPhone = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            alert("⚠️ عذراً، يجب السماح للطبيق بالوصول للصور لاختيار صورة البطل!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!heroName.trim()) {
            alert("⚠️ برجاء إدخال اسم البطل!");
            return;
        }

        const heroData = {
            name: heroName.trim(),
            hero_name: heroName.trim(),
            hero_avatar: selectedAvatar || "https://i.imgur.com/8Km9tLL.png",
            avatarPath: selectedAvatar || "https://i.imgur.com/8Km9tLL.png",
            level: Number(level),
            hero_level: Number(level),
            strength: Number(strength),
            hero_strength: Number(strength),
            agility: Number(agility),
            hero_agility: Number(agility),
            body: Number(body),
            hero_body: Number(body),
            spirit: Number(spirit),
            hero_spirit: Number(spirit),
            hp: Number(hp),
            hero_hp: Number(hp),
            maxHp: Number(maxHp),
            hero_max_hp: Number(maxHp),
            mp: Number(mp),
            hero_mp: Number(mp),
            maxMp: Number(maxMp),
            hero_max_mp: Number(maxMp),
            wealth: Number(wealth),
            hero_wealth: Number(wealth)
        };

        if (isEdit) {
            codexEngine.saveHeroData(heroId, heroData);
            alert("💾 تم حفظ التعديلات نهائياً!");
        } else {
            codexEngine.createHero(heroData);
            alert("🎉 تم إنشاء البطل الجديد بنجاح!");
        }
        onNavigate('heroes');
    };

    const renderCounter = (label, val, setVal, step = 1) => (
        <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>{label}</Text>
            <View style={styles.counterBox}>
                <TouchableOpacity style={styles.countBtn} onPress={() => setVal(Math.max(0, val - step))}>
                    <Text style={styles.countBtnText}>-</Text>
                </TouchableOpacity>
                <TextInput 
                    style={styles.countInput}
                    keyboardType="numeric"
                    value={String(val)}
                    onChangeText={(text) => setVal(parseInt(text) || 0)}
                />
                <TouchableOpacity style={styles.countBtn} onPress={() => setVal(val + step)}>
                    <Text style={styles.countBtnText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: '#3498db' }]} onPress={() => onNavigate('heroes')}>
                <Text style={styles.btnText}>⬅️ رجوع للقائمة</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.accent }]}>
                {isEdit ? "✏️ لوحة تعديل بيانات البطل" : "➕ إضافة بطل جديد"}
            </Text>

            {/* اسم البطل */}
            <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>اسم البطل:</Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder="أدخل الاسم..."
                    placeholderTextColor="#a1a1aa"
                    value={heroName}
                    onChangeText={setHeroName}
                />
            </View>

            {/* 🌟 اختيار صورة البطل من الهاتف أو الصور الجاهزة */}
            <View style={styles.imgSection}>
                <Text style={styles.controlLabel}>🖼️ صورة البطل:</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 }}>
                    <TouchableOpacity 
                        style={[styles.pickImgBtn, { backgroundColor: theme.accent }]}
                        onPress={pickImageFromPhone}
                    >
                        <Text style={styles.btnText}>📁 اختر صورة من الهاتف</Text>
                    </TouchableOpacity>
                    {selectedAvatar ? (
                        <Image source={{ uri: selectedAvatar }} style={{ width: 45, height: 45, borderRadius: 6, borderWidth: 1, borderColor: '#2ed573' }} />
                    ) : (
                        <Text style={{ fontSize: 9, color: '#a4b0be' }}>لم يتم اختيار صورة</Text>
                    )}
                </View>

                <TextInput 
                    style={[styles.textInput, { marginBottom: 6, width: '100%' }]}
                    placeholder="🔍 أو ابحث في الصور الجاهزة..."
                    placeholderTextColor="#a1a1aa"
                    value={imgSearch}
                    onChangeText={setImgSearch}
                />
                <ScrollView horizontal style={{ maxHeight: 55 }}>
                    {imageFiles
                        .filter(img => img.name.toLowerCase().includes(imgSearch.toLowerCase()))
                        .map((imgFile, i) => (
                            <TouchableOpacity 
                                key={i} 
                                style={[styles.imgThumb, selectedAvatar === imgFile.uri && { borderColor: '#2ed573', borderWidth: 2 }]}
                                onPress={() => setSelectedAvatar(imgFile.uri)}
                            >
                                <Image source={{ uri: imgFile.uri }} style={{ width: 45, height: 45, borderRadius: 4 }} />
                            </TouchableOpacity>
                        ))}
                </ScrollView>
            </View>

            {/* العدادات والإحصائيات */}
            {renderCounter("💪 القوة (STR)", strength, setStrength)}
            {renderCounter("🏃 الرشاقة (AGI)", agility, setAgility)}
            {renderCounter("🛡️ الجسد (BODY)", body, setBody)}
            {renderCounter("🔮 الروح (SPIRIT)", spirit, setSpirit)}
            {renderCounter("❤️ الصحة (HP)", hp, setHp, 10)}
            {renderCounter("💙 المانا (MP)", mp, setMp, 10)}
            {renderCounter("⭐ المستوى (Level)", level, setLevel)}
            {renderCounter("💰 الثروة", wealth, setWealth, 10)}

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={handleSave}>
                <Text style={styles.btnText}>{isEdit ? "💾 حفظ التعديلات" : "🚀 إنشاء البطل"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', gap: 10, paddingBottom: 30 },
    title: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
    backBtn: { padding: 8, borderRadius: 6, alignItems: 'center', marginBottom: 5 },
    controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8 },
    controlLabel: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
    textInput: { width: '55%', padding: 6, backgroundColor: '#1e1e2f', color: '#ffd700', borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, fontSize: 10, textAlign: 'center' },
    counterBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    countBtn: { width: 26, height: 26, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    countBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    countInput: { width: 50, textAlign: 'center', backgroundColor: '#1e1e2f', color: '#ffd700', borderWidth: 1, borderColor: '#d4af37', borderRadius: 6, fontSize: 10, padding: 2 },
    imgSection: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8, gap: 6 },
    pickImgBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
    imgThumb: { marginRight: 6, padding: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    saveBtn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});
