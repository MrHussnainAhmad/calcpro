import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { complex, mean, std, variance, median } from '../lib/math';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function AdvancedMathScreen() {
    const navigation = useNavigation();
    const [tab, setTab] = useState<'Complex' | 'Stats'>('Complex');

    // Complex state
    const [compA, setCompA] = useState('');
    const [compB, setCompB] = useState('');
    const [compRes, setCompRes] = useState<string | null>(null);

    // Stats state
    const [dataInput, setDataInput] = useState('');
    const [statsRes, setStatsRes] = useState<any>(null);

    const runComplex = (op: string) => {
        try {
            const math = require('../lib/math').default;
            const c1 = complex(compA);
            const c2 = complex(compB);
            let res: any;
            switch (op) {
                case 'add': res = math.add(c1, c2); break;
                case 'sub': res = math.subtract(c1, c2); break;
                case 'mul': res = math.multiply(c1, c2); break;
                case 'div': res = math.divide(c1, c2); break;
            }
            setCompRes(res.toString());
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            setCompRes('Invalid format (e.g. 2+3i)');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const runStats = () => {
        try {
            const arr = dataInput.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            if (arr.length === 0) throw new Error();

            setStatsRes({
                mean: mean(arr),
                median: median(arr),
                std: std(arr),
                var: variance(arr),
                count: arr.length
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            setStatsRes('Invalid data. Use comma separated numbers.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Complex & Stats</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, tab === 'Complex' && styles.activeTab]} onPress={() => setTab('Complex')}>
                    <Text style={[styles.tabText, tab === 'Complex' && styles.activeTabText]}>Complex</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, tab === 'Stats' && styles.activeTab]} onPress={() => setTab('Stats')}>
                    <Text style={[styles.tabText, tab === 'Stats' && styles.activeTabText]}>Statistics</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {tab === 'Complex' ? (
                    <View>
                        <View style={styles.card}>
                            <Text style={styles.label}>Complex Number A:</Text>
                            <TextInput
                                style={styles.input}
                                value={compA}
                                onChangeText={setCompA}
                                placeholder="e.g. 2 + 3i"
                                placeholderTextColor={Colors.gray}
                                autoCapitalize="none"
                            />
                            <Text style={styles.label}>Complex Number B:</Text>
                            <TextInput
                                style={styles.input}
                                value={compB}
                                onChangeText={setCompB}
                                placeholder="e.g. 1 - 4i"
                                placeholderTextColor={Colors.gray}
                                autoCapitalize="none"
                            />

                            <View style={styles.opGrid}>
                                {['add', 'sub', 'mul', 'div'].map(op => (
                                    <TouchableOpacity key={op} style={styles.opBtn} onPress={() => runComplex(op)}>
                                        <Text style={styles.opBtnText}>{op.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        {compRes && (
                            <View style={styles.resultCard}>
                                <Text style={styles.resultLabel}>Result:</Text>
                                <Text style={styles.resultValue}>{compRes}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        <View style={styles.card}>
                            <Text style={styles.label}>Data set (comma separated):</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                multiline
                                value={dataInput}
                                onChangeText={setDataInput}
                                placeholder="10, 20, 15, 30, 25"
                                placeholderTextColor={Colors.gray}
                            />
                            <TouchableOpacity style={styles.calcBtn} onPress={runStats}>
                                <Text style={styles.calcBtnText}>Analyze Data</Text>
                            </TouchableOpacity>
                        </View>

                        {statsRes && typeof statsRes !== 'string' && (
                            <View style={styles.statsGrid}>
                                <StatItem label="Mean" value={statsRes.mean.toFixed(2)} />
                                <StatItem label="Median" value={statsRes.median.toString()} />
                                <StatItem label="Std Dev" value={statsRes.std.toFixed(2)} />
                                <StatItem label="Variance" value={statsRes.var.toFixed(2)} />
                                <StatItem label="Count" value={statsRes.count.toString()} />
                            </View>
                        )}

                        {typeof statsRes === 'string' && (
                            <Text style={styles.errorText}>{statsRes}</Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const StatItem = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.statItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.secondary,
        padding: 4,
        borderRadius: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: Colors.accent,
    },
    tabText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.secondary,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: Colors.dark,
        color: 'white',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    opGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    opBtn: {
        width: '23%',
        backgroundColor: Colors.gray,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    opBtnText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    resultCard: {
        backgroundColor: '#1C1C1E',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.accent,
    },
    resultLabel: {
        color: Colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resultValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    calcBtn: {
        backgroundColor: Colors.accent,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    calcBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    statLabel: {
        color: Colors.textSecondary,
        fontSize: 10,
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    statValue: {
        color: Colors.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#CF6679',
        textAlign: 'center',
    }
});
