import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function HeroesView({ codexEngine, theme, dict, onSelectHero, onNavigate }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    // جلب جميع الأبطال من محرك التخزين المحلي
    const rawHeroes = codexEngine.getData('heroes');
    const heroes = rawHeroes.map(h => codexEngine.getHeroData(h.id)).filter(h => h.name.includes(searchQuery));

    return (
        <View style={styles.container}>
            {/* شريط البحث */}
            <TextInput 
                style={[styles.searchInput, { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)', color: theme.text }]}
                placeholder={dict.searchPlaceholder}
                placeholderTextColor="#a1a1aa"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* شريط كروت الأبطال القابل للتمرير */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sliderTrack}>
                {heroes.length === 0 ? (
                    <Text style={styles.emptyText}>لا توجد شخصيات مطابقة للبحث</Text>
                ) : (
                    heroes.map(hero => (
                        <View key={hero.id} style={styles.card}>
                            {/* خلفية الصورة مع التمويه/التعديل */}
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                                <Image source={{ uri: hero.imgSrc }} style={styles.cardBgImg} resizeMode="cover" />
                                <View style={styles.cardOverlay} />
                            </View>

                            {/* مستوى البطل */}
                            <View style={styles.cardHeader}>
                                <View style={styles.lvlBadge}>
                                    <Text style={styles.lvlText}>LVL {hero.level}</Text>
                                </View>
                            </View>

                            {/* تفاصيل الكارت وأزرار التحكم */}
                            <View style={styles.cardFooter}>
                                <Text style={styles.cardName} numberOfLines={1}>{hero.name}</Text>
                                <View style={styles.btnRow}>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, { backgroundColor: theme.accent }]}
                                        onPress={() => {
                                            onSelectHero(hero.id);
                                            onNavigate('home');
                                        }}
                                    >
                                        <Text style={styles.btnText}>{dict.selectBtnText}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={styles.detailsActionBtn}
                                        onPress={() => {
                                            onSelectHero(hero.id);
                                            onNavigate('heroDetails');
                                        }}
                                    >
                                        <Text style={styles.btnText}>{dict.detailsBtnText}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
    },
    searchInput: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 11,
        outlineStyle: 'none',
    },
    sliderTrack: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 5,
        paddingHorizontal: 2,
    },
    emptyText: {
        fontSize: 11,
        opacity: 0.6,
        textAlign: 'center',
        width: '100%',
        padding: 20,
        color: '#fff',
    },
    card: {
        width: 150,
        height: 220,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        boxSizing: 'border-box',
    },
    cardBgImg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        filter: 'brightness(0.8)',
    },
    cardOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.9) 90%)',
    },
    cardHeader: {
        zIndex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    lvlBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(250,204,21,0.3)',
    },
    lvlText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#facc15',
    },
    cardFooter: {
        zIndex: 3,
        gap: 4,
    },
    cardName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    btnRow: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 2,
    },
    actionBtn: {
        flex: 1,
        borderRadius: 6,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsActionBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 6,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    }
});
