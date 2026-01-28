import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CONVERSION_TYPES = [
    {
        title: 'Unit Conversion',
        subtitle: 'Length, Mass, Area, Volume & More',
        icon: 'resize',
        color: ['#FF9500', '#FF5E00'],
        route: 'UnitConverter'
    },
    {
        title: 'Time Conversion',
        subtitle: 'Decades, Years, Months, Weeks & More',
        icon: 'time',
        color: ['#007AFF', '#0055FF'],
        route: 'TimeConversion'
    },
    {
        title: 'Currency Conversion',
        subtitle: 'Real-time Exchange Rates Worldwide',
        icon: 'cash',
        color: ['#34C759', '#1A8E34'],
        route: 'CurrencyConversion'
    },
    {
        title: 'Data Conversion',
        subtitle: 'Bytes, KB, MB, GB, TB & PB',
        icon: 'server',
        color: ['#5856D6', '#3E3BB5'],
        route: 'DataConversion'
    },
];

export default function ConversionsMenuScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.accent} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Conversions</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {CONVERSION_TYPES.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        // @ts-ignore
                        onPress={() => navigation.navigate(item.route)}
                        activeOpacity={0.8}
                        style={styles.card}
                    >
                        <LinearGradient
                            colors={item.color as [string, string]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons name={item.icon as any} size={24} color="white" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Convert between different units, time zones, currencies, and data sizes with precision.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    card: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    infoBox: {
        marginTop: 30,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        marginLeft: 8,
        flex: 1,
    }
});
