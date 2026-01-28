import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Data units with binary (1024) conversion - Bytes and Bits
const DATA_UNITS = [
    // Bytes-based
    { name: 'Petabytes', abbr: 'PB', toBytes: Math.pow(1024, 5), category: 'Bytes' },
    { name: 'Terabytes', abbr: 'TB', toBytes: Math.pow(1024, 4), category: 'Bytes' },
    { name: 'Gigabytes', abbr: 'GB', toBytes: Math.pow(1024, 3), category: 'Bytes' },
    { name: 'Megabytes', abbr: 'MB', toBytes: Math.pow(1024, 2), category: 'Bytes' },
    { name: 'Kilobytes', abbr: 'KB', toBytes: 1024, category: 'Bytes' },
    { name: 'Bytes', abbr: 'B', toBytes: 1, category: 'Bytes' },
    // Bits-based (1 Byte = 8 bits)
    { name: 'Petabits', abbr: 'Pb', toBytes: Math.pow(1024, 5) / 8, category: 'Bits' },
    { name: 'Terabits', abbr: 'Tb', toBytes: Math.pow(1024, 4) / 8, category: 'Bits' },
    { name: 'Gigabits', abbr: 'Gb', toBytes: Math.pow(1024, 3) / 8, category: 'Bits' },
    { name: 'Megabits', abbr: 'Mb', toBytes: Math.pow(1024, 2) / 8, category: 'Bits' },
    { name: 'Kilobits', abbr: 'Kb', toBytes: 1024 / 8, category: 'Bits' },
    { name: 'Bits', abbr: 'bit', toBytes: 1 / 8, category: 'Bits' },
];

export default function DataConversionScreen() {
    const navigation = useNavigation();
    const [fromUnit, setFromUnit] = useState(DATA_UNITS[2]); // GB
    const [toUnit, setToUnit] = useState(DATA_UNITS[3]); // MB
    const [inputValue, setInputValue] = useState('1');
    const [outputValue, setOutputValue] = useState('');

    useEffect(() => {
        try {
            const val = parseFloat(inputValue);
            if (isNaN(val)) {
                setOutputValue('');
                return;
            }

            // Convert from input unit to bytes, then to output unit
            const bytes = val * fromUnit.toBytes;
            const result = bytes / toUnit.toBytes;

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
                <Text style={styles.title}>Data Conversion</Text>
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
                                {DATA_UNITS.map(unit => (
                                    <TouchableOpacity
                                        key={unit.abbr}
                                        onPress={() => setFromUnit(unit)}
                                        style={[styles.unitItem, fromUnit.abbr === unit.abbr && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, fromUnit.abbr === unit.abbr && styles.activeUnitItemText]}>
                                            {unit.abbr}
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
                                {DATA_UNITS.map(unit => (
                                    <TouchableOpacity
                                        key={unit.abbr}
                                        onPress={() => setToUnit(unit)}
                                        style={[styles.unitItem, toUnit.abbr === unit.abbr && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, toUnit.abbr === unit.abbr && styles.activeUnitItemText]}>
                                            {unit.abbr}
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
                        Binary (1024-based) conversion. 1 KB = 1024 Bytes, 1 Byte = 8 bits
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
        width: 100,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        marginLeft: 10,
        paddingLeft: 10,
    },
    unitList: {
        flex: 1,
    },
    unitItem: {
        paddingVertical: 8,
        borderRadius: 5,
        marginBottom: 2,
        alignItems: 'center',
    },
    activeUnitItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    unitItemText: {
        color: Colors.textSecondary,
        fontSize: 14,
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
