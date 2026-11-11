import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getTheme, themesMap, dicts } from './src/database/theme';
import StandaloneCodexEngine from './src/database/dbEngine';

import HomeView from './src/components/HomeView';
import HeroesView from './src/components/HeroesView';
import HeroDetailsView from './src/components/HeroDetailsView';
import BackpackView from './src/components/BackpackView';
import ShopView from './src/components/ShopView';
import SkillsView from './src/components/SkillsView';
import LevelsView from './src/components/LevelsView';

export default function App() {
    const [codexEngine, setCodexEngine] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [themeMode, setThemeMode] = useState('darkGlass');
    const [lang, setLang] = useState('ar');
    const [selectedHeroId, setSelectedHeroId] = useState(null);

    // تهيئة المحرك بأمان داخل useEffect لمنع الانهيار وضمان العمل على الموبايل
    useEffect(() => {
        try {
            const engine = new StandaloneCodexEngine();
            setCodexEngine(engine);
        } catch (e) {
            console.log("Error initializing engine:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    if (!isLoaded || !codexEngine) {
        const fallbackTheme = getTheme('darkGlass');
        return (
            <View style={[styles.container, { backgroundColor: fallbackTheme.mainBg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={fallbackTheme.accent} />
                <Text style={{ color: fallbackTheme.text, marginTop: 10, fontSize: 12 }}>جاري تحميل عالم Character Codex...</Text>
            </View>
        );
    }

    const currentTheme = getTheme(themeMode);
    const currentDict = dicts[lang] || dicts.ar;

    // تحديد البطل النشط بأمان تام
    let activeHeroes = [];
    try {
        const rawHeroes = codexEngine.getData('heroes');
        if (Array.isArray(rawHeroes)) {
            activeHeroes = rawHeroes;
        }
    } catch (err) {
        activeHeroes = [];
    }

    const activeHeroId = selectedHeroId || (activeHeroes.length > 0 ? activeHeroes[0].id : null);
    const heroData = activeHeroId ? codexEngine.getHeroData(activeHeroId) : null;

    const renderActiveView = () => {
        switch (currentView) {
            case 'home':
                return <HomeView hero={heroData} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'heroes':
                return <HeroesView codexEngine={codexEngine} theme={currentTheme} dict={currentDict} onSelectHero={setSelectedHeroId} onNavigate={setCurrentView} />;
            case 'heroDetails':
                return <HeroDetailsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'backpack':
                return <BackpackView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'shop':
                return <ShopView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'skills':
                return <SkillsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'levels':
                return <LevelsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'settings':
                return (
                    <View style={styles.settingsBox}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>🎨 اختر الثيم والنمط العام:</Text>
                        {Object.keys(themesMap).map(key => {
                            const th = themesMap[key];
                            const isSelected = themeMode === key;
                            return (
                                <TouchableOpacity 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getTheme, themesMap, dicts } from './src/database/theme';
import StandaloneCodexEngine from './src/database/dbEngine';

import HomeView from './src/components/HomeView';
import HeroesView from './src/components/HeroesView';
import HeroDetailsView from './src/components/HeroDetailsView';
import BackpackView from './src/components/BackpackView';
import ShopView from './src/components/ShopView';
import SkillsView from './src/components/SkillsView';
import LevelsView from './src/components/LevelsView';
import AddEditHeroView from './src/components/AddEditHeroView'; // 🌟 شاشة الإضافة والتعديل الجديدة

export default function App() {
    const [codexEngine, setCodexEngine] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [themeMode, setThemeMode] = useState('darkGlass');
    const [lang, setLang] = useState('ar');
    const [selectedHeroId, setSelectedHeroId] = useState(null);

    useEffect(() => {
        try {
            const engine = new StandaloneCodexEngine();
            setCodexEngine(engine);
        } catch (e) {
            console.log("Error initializing engine:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    if (!isLoaded || !codexEngine) {
        const fallbackTheme = getTheme('darkGlass');
        return (
            <View style={[styles.container, { backgroundColor: fallbackTheme.mainBg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={fallbackTheme.accent} />
                <Text style={{ color: fallbackTheme.text, marginTop: 10, fontSize: 12 }}>جاري تحميل عالم Character Codex...</Text>
            </View>
        );
    }

    const currentTheme = getTheme(themeMode);
    const currentDict = dicts[lang] || dicts.ar;

    let activeHeroes = [];
    try {
        const rawHeroes = codexEngine.getData('heroes');
        if (Array.isArray(rawHeroes)) {
            activeHeroes = rawHeroes;
        }
    } catch (err) {
        activeHeroes = [];
    }

    const activeHeroId = selectedHeroId || (activeHeroes.length > 0 ? activeHeroes[0].id : null);
    const heroData = activeHeroId ? codexEngine.getHeroData(activeHeroId) : null;

    const renderActiveView = () => {
        switch (currentView) {
            case 'home':
                return <HomeView hero={heroData} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'heroes':
                return <HeroesView codexEngine={codexEngine} theme={currentTheme} dict={currentDict} onSelectHero={setSelectedHeroId} onNavigate={setCurrentView} />;
            case 'heroDetails':
                return <HeroDetailsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'backpack':
                return <BackpackView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'shop':
                return <ShopView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'skills':
                return <SkillsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'levels':
                return <LevelsView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} />;
            case 'addHero': // 🌟 إضافة بطل جديد
                return <AddEditHeroView codexEngine={codexEngine} heroId={null} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'editHero': // 🌟 تعديل البطل الحالي
                return <AddEditHeroView codexEngine={codexEngine} heroId={activeHeroId} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
            case 'settings':
                return (
                    <View style={styles.settingsBox}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>🎨 اختر الثيم والنمط العام:</Text>
                        {Object.keys(themesMap).map(key => {
                            const th = themesMap[key];
                            const isSelected = themeMode === key;
                            return (
                                <TouchableOpacity 
                                    key={key} 
                                    style={[
                                        styles.themeCard, 
                                        { backgroundColor: th.mainBg, borderColor: isSelected ? currentTheme.accent : th.navBorder }
                                    ]}
                                    onPress={() => setThemeMode(key)}
                                >
                                    <Text style={{ color: th.text, fontWeight: 'bold', fontSize: 12 }}>{th.name}</Text>
                                    {isSelected && <Text style={{ color: currentTheme.accent, fontSize: 11 }}>✔️ مفعل</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            default:
                return <HomeView hero={heroData} theme={currentTheme} dict={currentDict} onNavigate={setCurrentView} />;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.mainBg }]}>
            {/* شريط العنوان العلوي */}
            <View style={styles.topBar}>
                <TouchableOpacity 
                    style={styles.menuBtn}
                    onPress={() => setCurrentView(currentView === 'sidebar' ? 'home' : 'sidebar')}
                >
                    <Text style={{ color: currentTheme.text, fontSize: 16 }}>☰</Text>
                </TouchableOpacity>
                <Text style={[styles.topTitle, { color: currentTheme.text }]}>Character Codex</Text>
            </View>

            {/* محتوى الشاشات */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {currentView === 'sidebar' ? (
                    <View style={styles.sidebarBox}>
                        {[
                            { id: 'backpack', icon: '🎒', label: 'المخزن والحقيبة' },
                            { id: 'shop', icon: '🛒', label: 'المتجر والتجارة' },
                            { id: 'skills', icon: '⚡', label: 'شجرة المهارات' },
                            { id: 'levels', icon: '⭐', label: 'المستويات والخبرة' }
                        ].map(link => (
                            <TouchableOpacity 
                                key={link.id} 
                                style={styles.sidebarLink}
                                onPress={() => setCurrentView(link.id)}
                            >
                                <Text style={{ fontSize: 16 }}>{link.icon}</Text>
                                <Text style={[styles.sidebarLinkText, { color: currentTheme.text }]}>{link.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    renderActiveView()
                )}
            </ScrollView>

            {/* الزرار العائم للاختصارات السريعة (يفتح شاشة إضافة بطل جديد) */}
            <TouchableOpacity 
                style={[styles.floatingBtn, { backgroundColor: currentTheme.accent }]}
                onPress={() => setCurrentView('addHero')}
            >
                <Text style={{ fontSize: 22, color: '#fff' }}>➕</Text>
            </TouchableOpacity>

            {/* البار السفلي الدائري */}
            <View style={[styles.bottomNav, { backgroundColor: currentTheme.navBg, borderColor: currentTheme.navBorder }]}>
                {[
                    { id: 'home', icon: '🏠', label: 'الرئيسية' },
                    { id: 'heroes', icon: '👥', label: 'الشخصيات' },
                    { id: 'settings', icon: '⚙️', label: 'الإعدادات' }
                ].map(tab => {
                    const isActive = currentView === tab.id;
                    return (
                        <TouchableOpacity 
                            key={tab.id}
                            style={[styles.tabItem, isActive && { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14 }]}
                            onPress={() => setCurrentView(tab.id)}
                        >
                            <Text style={{ fontSize: 15 }}>{tab.icon}</Text>
                            <Text style={[styles.tabLabel, { color: isActive ? currentTheme.accent : currentTheme.text }]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, direction: 'rtl' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, zIndex: 10 },
    menuBtn: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    topTitle: { fontSize: 12, fontWeight: 'bold' },
    contentContainer: { padding: 15, paddingBottom: 90 },
    bottomNav: { position: 'absolute', bottom: 10, left: 15, right: 15, height: 55, borderRadius: 30, borderWidth: 1, zIndex: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, elevation: 10 },
    tabItem: { flexDirection: 'column', alignItems: 'center', gap: 2, paddingVertical: 4, paddingHorizontal: 14 },
    tabLabel: { fontSize: 8, fontWeight: 'bold' },
    sidebarBox: { gap: 8 },
    sidebarLink: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    sidebarLinkText: { fontSize: 11, fontWeight: 'bold' },
    settingsBox: { gap: 10, paddingVertical: 10 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
    themeCard: { padding: 12, borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    floatingBtn: { position: 'absolute', bottom: 75, right: 20, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', zIndex: 60, elevation: 8 }
});
