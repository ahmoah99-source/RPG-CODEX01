import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HomeView({ hero, theme, dict, onNavigate }) {
    return (
        <View style={styles.container}>
            {hero ? (
                /* --- حالة وجود بطل نشط ومقترن --- */
                <View style={styles.heroBox}>
                    <View style={[styles.avatarContainer, { borderColor: theme.accent }]}>
                        <Image 
                            source={{ uri: hero.imgSrc }} 
                            style={styles.avatarImg} 
                            resizeMode="contain" 
                        />
                    </View>
                    <Text style={[styles.heroName, { color: theme.text }]}>{hero.name}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {hero.level}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.detailsBtn, { backgroundColor: theme.accent }]}
                        onPress={() => onNavigate('heroDetails')}
                    >
                        <Text style={styles.detailsBtnText}>عرض التفاصيل الكاملة</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                /* --- الحالة الترحيبية الفارغة (لا يوجد بطل محدد) --- */
                <View style={styles.welcomeBox}>
                    <Text style={styles.welcomeIcon}>🛡️</Text>
                    <Text style={[styles.welcomeMsg, { color: theme.text }]}>{dict.welcomeMsg}</Text>
                    <Text style={styles.welcomeSub}>{dict.welcomeSub}</Text>
                    
                    <TouchableOpacity 
                        style={[styles.selectHeroBtn, { backgroundColor: theme.accent }]}
                        onPress={() => onNavigate('heroes')}
                    >
                        <Text style={styles.selectHeroBtnText}>{dict.selectHeroBtn}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    heroBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 10,
    },
    avatarContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(0,0,0,0.4)',
        overflow: 'hidden',
        borderWidth: 3,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    heroName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    levelBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(250,204,21,0.3)',
    },
    levelText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#facc15',
    },
    detailsBtn: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    detailsBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    welcomeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 30,
        width: '100%',
    },
    welcomeIcon: {
        fontSize: 36,
        marginBottom: 12,
    },
    welcomeMsg: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeSub: {
        fontSize: 10,
        opacity: 0.7,
        lineHeight: 22,
        marginBottom: 20,
        maxWidth: 260,
        textAlign: 'center',
        color: '#a1a1aa',
    },
    selectHeroBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    selectHeroBtnText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    }
});
