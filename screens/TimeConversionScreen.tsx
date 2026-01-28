import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const TIME_UNITS = [
    { name: 'Decades', abbr: 'decade', toSeconds: 315360000 },
    { name: 'Years', abbr: 'year', toSeconds: 31536000 },
    { name: 'Months', abbr: 'month', toSeconds: 2592000 }, // 30 days
    { name: 'Weeks', abbr: 'week', toSeconds: 604800 },
    { name: 'Days', abbr: 'day', toSeconds: 86400 },
    { name: 'Hours', abbr: 'hour', toSeconds: 3600 },
    { name: 'Minutes', abbr: 'min', toSeconds: 60 },
    { name: 'Seconds', abbr: 'sec', toSeconds: 1 },
    { name: 'Milliseconds', abbr: 'ms', toSeconds: 0.001 },
];

export default function TimeConversionScreen() {
    const navigation = useNavigation();
    const [fromUnit, setFromUnit] = useState(TIME_UNITS[1]); // Years
    const [toUnit, setToUnit] = useState(TIME_UNITS[4]); // Days
    const [inputValue, setInputValue] = useState('1');
    const [outputValue, setOutputValue] = useState('');

    useEffect(() => {
        try {
            const val = parseFloat(inputValue);
            if (isNaN(val)) {
                setOutputValue('');
                return;
            }

            // Convert from input unit to seconds, then to output unit
            const seconds = val * fromUnit.toSeconds;
            const result = seconds / toUnit.toSeconds;

            setOutputValue(result.toLocaleString(undefined, { maximumFractionDigits: 6 }));
        } catch (e) {
            setOutputValue('Error');
        }
    }, [inputValue, fromUnit, toUnit]);

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Time Conversion</Text>
            </View>

            <View style={styles.converterContent}>
                <View style={styles.card}>
                    <Text style={styles.label}>From</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                            keyboardType="numeric"
                        />
                        <View style={styles.unitSelector}>
                            <ScrollView style={styles.unitList}>
                                {TIME_UNITS.map(unit => (
                                    <TouchableOpacity
                                        key={unit.abbr}
                                        onPress={() => setFromUnit(unit)}
                                        style={[styles.unitItem, fromUnit.abbr === unit.abbr && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, fromUnit.abbr === unit.abbr && styles.activeUnitItemText]}>
                                            {unit.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={swapUnits} style={styles.swapBtn}>
                    <Ionicons name="swap-vertical" size={24} color={Colors.accent} />
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.label}>To</Text>
                    <View style={styles.inputRow}>
                        <Text style={styles.resultValue}>{outputValue || '0'}</Text>
                        <View style={styles.unitSelector}>
                            <ScrollView style={styles.unitList}>
                                {TIME_UNITS.map(unit => (
                                    <TouchableOpacity
                                        key={unit.abbr}
                                        onPress={() => setToUnit(unit)}
                                        style={[styles.unitItem, toUnit.abbr === unit.abbr && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, toUnit.abbr === unit.abbr && styles.activeUnitItemText]}>
                                            {unit.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>
                        Months are calculated as 30 days. Years are 365 days.
                    </Text>
                </View>
            </View>
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
    converterContent: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 15,
        height: 200,
    },
    label: {
        color: Colors.accent,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    inputRow: {
        flexDirection: 'row',
        flex: 1,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    resultValue: {
        flex: 1,
        color: '#34C759',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    unitSelector: {
        width: 120,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        marginLeft: 10,
        paddingLeft: 10,
    },
    unitList: {
        flex: 1,
    },
    unitItem: {
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 2,
        alignItems: 'center',
    },
    activeUnitItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    unitItemText: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    activeUnitItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
    swapBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.secondary,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    infoBox: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    infoText: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginLeft: 8,
        flex: 1,
    }
});
