import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Themes, AppTheme } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ThemeScreen() {
    const { theme, themeName, setTheme } = useTheme();
    const navigation = useNavigation();

    const themeOptions = Object.entries(Themes).map(([key, value]) => ({
        id: key as AppTheme,
        ...value
    }));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.accent} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textPrimary }]}>App Appearance</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CHOOSE THEME</Text>

                {themeOptions.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        activeOpacity={0.8}
                        onPress={() => setTheme(opt.id)}
                        style={[
                            styles.themeCard,
                            { backgroundColor: theme.secondary },
                            themeName === opt.id && { borderColor: theme.accent, borderWidth: 2 }
                        ]}
                    >
                        <View style={[styles.preview, { backgroundColor: opt.dark }]}>
                            <View style={[styles.previewBtn, { backgroundColor: opt.accent }]} />
                            <View style={[styles.previewText, { backgroundColor: opt.lightGray }]} />
                        </View>
                        <View style={styles.themeInfo}>
                            <Text style={[styles.themeName, { color: theme.textPrimary }]}>{opt.name}</Text>
                            {themeName === opt.id && (
                                <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={[styles.tipBox, { backgroundColor: theme.gray }]}>
                    <Ionicons name="sunny-outline" size={18} color={theme.accent} />
                    <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                        OLED theme saves battery on devices with AMOLED displays by using pure black pixels.
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
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 20,
    },
    themeCard: {
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    preview: {
        width: 60,
        height: 60,
        borderRadius: 12,
        padding: 10,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    previewBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    previewText: {
        width: '100%',
        height: 8,
        borderRadius: 4,
    },
    themeInfo: {
        flex: 1,
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    themeName: {
        fontSize: 18,
        fontWeight: '600',
    },
    tipBox: {
        marginTop: 30,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipText: {
        marginLeft: 15,
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    }
});
