import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
// @ts-ignore
import constantsData from '../assets/constants.json';

interface Constant {
    id: string;
    name: string;
    symbol: string;
    value: string;
    unit: string;
    category: string;
}

export default function ConstantsScreen() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const filteredConstants = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return constantsData;
        return constantsData.filter((c: Constant) =>
            c.name.toLowerCase().includes(query) ||
            c.symbol.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const groupedConstants = useMemo(() => {
        return filteredConstants.reduce((acc: any, c: Constant) => {
            (acc[c.category] ??= []).push(c);
            return acc;
        }, {});
    }, [filteredConstants]);

    const handleCopy = useCallback(async (text: string, id: string) => {
        await Clipboard.setStringAsync(text);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 2000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Scientific Constants</Text>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color={Colors.gray} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search constants (c, G, h...)"
                        placeholderTextColor={Colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.gray} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {Object.keys(groupedConstants).length === 0 ? (
                    <Text style={styles.noResults}>No constants found matching "{searchQuery}"</Text>
                ) : (
                    Object.entries(groupedConstants).map(([category, items]: [string, any]) => (
                        <View key={category} style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>{category}</Text>
                            {items.map((item: Constant) => (
                                <View key={item.id} style={styles.constantCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.symbolBox}>
                                            <Text style={styles.symbolText}>{item.symbol}</Text>
                                        </View>
                                        <View style={styles.nameBox}>
                                            <Text style={styles.constantName}>{item.name}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.copyBtn}
                                            onPress={() => handleCopy(item.value, item.id)}
                                        >
                                            <Ionicons
                                                name={copyStatus === item.id ? "checkmark-circle" : "copy-outline"}
                                                size={20}
                                                color={copyStatus === item.id ? "#34C759" : Colors.accent}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.valueRow}>
                                        <Text style={styles.constantValue} numberOfLines={1}>{item.value}</Text>
                                        <Text style={styles.constantUnit}>{item.unit}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

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
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    scrollContent: {
        padding: 20,
    },
    noResults: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 40,
    },
    categorySection: {
        marginBottom: 25,
    },
    categoryTitle: {
        color: Colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 5,
    },
    constantCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    symbolBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    symbolText: {
        color: 'white',
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    nameBox: {
        flex: 1,
    },
    constantName: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    copyBtn: {
        padding: 5,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        borderRadius: 10,
    },
    constantValue: {
        color: '#34C759',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        flex: 1,
    },
    constantUnit: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginLeft: 8,
    }
});
