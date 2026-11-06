import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function HeroDetailsView({ codexEngine, heroId, theme, dict, onNavigate }) {
    const hero = codexEngine.getHeroData(heroId);
    if (!hero) return <View style={styles.container}><Text style={{color: '#fff'}}>البطل غير موجود</Text></View>;

    const expPercent = Math.min(100, Math.max(0, (hero.exp / hero.maxExp) * 100));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* صورة البطل الكبرى */}
            <View style={styles.heroImgBox}>
                <Image source={{ uri: hero.imgSrc }} style={styles.heroImg} resizeMode="contain" />
            </View>

            {/* دوائر الصحة (HP) والمانا (MP) */}
            <View style={styles.circlesContainer}>
                <View style={styles.circleBox}>
                    <View style={[styles.circle, { borderColor: '#ff4757', backgroundColor: 'rgba(255,71,87,0.15)' }]}>
                        <Text style={[styles.circleVal, { color: '#ff4757' }]}>{hero.hp}</Text>
                        <Text style={styles.circleMax}>/{hero.maxHp}</Text>
                    </View>
                    <Text style={[styles.circleLabel, { color: '#ff4757' }]}>❤️ الصحة (HP)</Text>
                </View>

                <View style={styles.circleBox}>
                    <View style={[styles.circle, { borderColor: '#3498db', backgroundColor: 'rgba(52,152,219,0.15)' }]}>
                        <Text style={[styles.circleVal, { color: '#3498db' }]}>{hero.mp}</Text>
                        <Text style={styles.circleMax}>/{hero.maxMp}</Text>
                    </View>
                    <Text style={[styles.circleLabel, { color: '#3498db' }]}>💙 المانا (MP)</Text>
                </View>
            </View>

            {/* بار الخبرة (EXP) */}
            <View style={styles.expBarContainer}>
                <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>⭐ نقاط الخبرة (EXP)</Text>
                    <Text style={styles.expValue}>{hero.exp} / {hero.maxExp}</Text>
                </View>
                <View style={styles.expTrack}>
                    <View style={[styles.expFill, { width: `${expPercent}%` }]} />
                </View>
            </View>

            {/* إحصائيات البطل الأساسية */}
            <Text style={styles.sectionHeader}>{dict.statsLabel}</Text>
            <View style={styles.statsGrid}>
                {[
                    { label: "💪 القوة (STR)", val: hero.strength },
                    { label: "🏃 الرشاقة (AGI)", val: hero.agility },
                    { label: "🛡️ الجسد (BODY)", val: hero.body },
                    { label: "🔮 الروح (SPIRIT)", val: hero.spirit }
                ].map((st, idx) => (
                    <View key={idx} style={styles.statBox}>
                        <Text style={styles.statLabel}>{st.label}</Text>
                        <Text style={[styles.statVal, { color: theme.accent }]}>{st.val}</Text>
                    </View>
                ))}
            </View>

            {/* قسم المهارات والمواهب */}
            <Text style={styles.sectionHeader}>🔮 المهارات والمواهب</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalTrack}>
                {hero.skills.length === 0 ? (
                    <Text style={styles.emptySubText}>لا توجد مهارات مضافة.</Text>
                ) : (
                    hero.skills.map((skillName, idx) => (
                        <View key={idx} style={styles.miniCard}>
                            <Image source={{ uri: "https://i.imgur.com/8Km9tLL.png" }} style={styles.miniImg} />
                            <Text style={styles.miniTitle} numberOfLines={1}>{skillName}</Text>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* قسم عتاد ومخزون البطل */}
            <Text style={styles.sectionHeader}>🎒 مخزون وعتاد البطل</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalTrack}>
                {hero.inventory.length === 0 ? (
                    <Text style={styles.emptySubText}>لا يوجد عتاد مجهز.</Text>
                ) : (
                    hero.inventory.map((item, idx) => (
                        <View key={idx} style={styles.miniCard}>
                            <Image source={{ uri: item.img || "https://i.imgur.com/8Km9tLL.png" }} style={styles.miniImg} />
                            <Text style={styles.miniTitle} numberOfLines={1}>{item.name}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 12,
        paddingBottom: 20,
    },
    heroImgBox: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImg: {
        width: '100%',
        height: '100%',
    },
    circlesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginVertical: 4,
    },
    circleBox: {
        alignItems: 'center',
        gap: 4,
    },
    circle: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    circleVal: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    circleMax: {
        fontSize: 7,
        opacity: 0.7,
        color: '#fff',
    },
    circleLabel: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    expBarContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(250,204,21,0.2)',
        gap: 4,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        fontWeight: 'bold',
    },
    expTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#facc15',
    },
    expValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#facc15',
    },
    expTrack: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    expFill: {
        height: '100%',
        backgroundColor: '#f1c40f',
        borderRadius: 4,
    },
    sectionHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffd700',
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    statBox: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: 'rgba(255,255,255,0.06)',
        padding: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statLabel: {
        fontSize: 8,
        opacity: 0.7,
        color: '#fff',
    },
    statVal: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    horizontalTrack: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 2,
    },
    emptySubText: {
        fontSize: 9,
        opacity: 0.6,
        color: '#fff',
        padding: 5,
    },
    miniCard: {
        width: 85,
        height: 95,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 4,
    },
    miniImg: {
        width: 28,
        height: 28,
        borderRadius: 6,
    },
    miniTitle: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    }
});
