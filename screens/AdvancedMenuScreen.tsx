import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MENU_ITEMS = [
    { title: 'Calculus Solver', subtitle: 'Derivatives, Integrals, Solve', icon: 'infinite', color: ['#FF9500', '#FF5E00'], route: 'Calculus' },
    { title: 'Matrix Calculator', subtitle: 'Linear Algebra (2x2, 3x3)', icon: 'grid', color: ['#007AFF', '#0055FF'], route: 'Matrix' },
    { title: 'Graphing Engine', subtitle: '2D Plotting & Data Tables', icon: 'stats-chart', color: ['#34C759', '#1A8E34'], route: 'Graph' },
    { title: 'Scientific Constants', subtitle: 'Fundamental Physics & Math', icon: 'thermometer', color: ['#FF2D55', '#D61A3C'], route: 'Constants' },
    { title: 'Unit Converter', subtitle: 'Engineering & Metric Conversions', icon: 'repeat', color: ['#17A2B8', '#117A8B'], route: 'UnitConverter' },
    { title: 'Financial Suite', subtitle: 'TVM, Loans & Real-world Projections', icon: 'cash', color: ['#34C759', '#2E7D32'], route: 'Finance' },
    { title: 'Appearance & Themes', subtitle: 'Personalize App Colors & Icons', icon: 'color-palette', color: ['#FF2D55', '#D61A3C'], route: 'Themes' },
    { title: 'Math Scratchpad', subtitle: 'Multi-line Equation Derivations', icon: 'create', color: ['#6F42C1', '#5A32A3'], route: 'Scratchpad' },
    { title: 'Complex & Stats', subtitle: 'Imaginary Numbers & Analysis', icon: 'flask', color: ['#5856D6', '#3E3BB5'], route: 'AdvancedMath' },
];

export default function AdvancedMenuScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.accent} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Advanced Solvers</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {MENU_ITEMS.map((item, index) => (
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
                        These solvers are designed for university-level engineering and mathematics. All calculations are performed offline.
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
