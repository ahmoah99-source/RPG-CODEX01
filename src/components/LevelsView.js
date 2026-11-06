import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function LevelsView({ codexEngine, theme, dict }) {
    const energySystems = codexEngine.loadEnergySystems();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, { color: theme.accent }]}>⭐ مستويات القوة وأنظمة الطاقة</Text>

            {Object.keys(energySystems).map((sysName, sIdx) => {
                const sysObj = energySystems[sysName];
                return (
                    <View key={sIdx} style={styles.sysBox}>
                        <Text style={styles.sysTitle}>🔮 النظام: {sysName}</Text>
                        
                        {Object.keys(sysObj.categories || {}).map((catName, cIdx) => {
                            const catObj = sysObj.categories[catName];
                            return (
                                <View key={cIdx} style={styles.catBox}>
                                    <Text style={styles.catTitle}>📁 {catName}</Text>
                                    
                                    {Object.keys(catObj.levels || {}).map((lvlName, lIdx) => {
                                        const lvl = catObj.levels[lvlName];
                                        return (
                                            <View key={lIdx} style={styles.lvlCard}>
                                                <Text style={styles.lvlName}>{lvlName}</Text>
                                                <Text style={styles.lvlDetails}>⏳ العمر/النشاط: {lvl.age} | ⚡ المضاعف: {lvl.power}</Text>
                                                <Text style={styles.lvlDesc}>{lvl.desc}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </ScrollView>
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
    sysBox: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        gap: 8,
    },
    sysTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ffd700',
    },
    catBox: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: 8,
        borderRadius: 8,
        gap: 6,
    },
    catTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#a4b0be',
    },
    lvlCard: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 2,
    },
    lvlName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2ed573',
    },
    lvlDetails: {
        fontSize: 8,
        color: '#f1c40f',
        fontWeight: 'bold',
    },
    lvlDesc: {
        fontSize: 8,
        opacity: 0.7,
        color: '#ccc',
    }
});
