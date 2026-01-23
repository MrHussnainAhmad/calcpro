import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { unit } from '../lib/math';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const UNIT_GROUPS = [
    {
        name: 'Length',
        units: ['m', 'cm', 'mm', 'km', 'inch', 'foot', 'yard', 'mile', 'lightyear']
    },
    {
        name: 'Mass',
        units: ['kg', 'g', 'mg', 'lb', 'oz', 'tonne']
    },
    {
        name: 'Area',
        units: ['m2', 'cm2', 'km2', 'sqinch', 'sqfoot', 'acre', 'hectare']
    },
    {
        name: 'Volume',
        units: ['m3', 'L', 'ml', 'cup', 'pint', 'quart', 'gallon']
    },
    {
        name: 'Force',
        units: ['N', 'lbf', 'dyn', 'kip']
    },
    {
        name: 'Energy',
        units: ['J', 'kJ', 'cal', 'kcal', 'kWh', 'eV', 'BTU']
    },
    {
        name: 'Pressure',
        units: ['Pa', 'kPa', 'bar', 'psi', 'atm', 'torr', 'mmHg']
    },
    {
        name: 'Power',
        units: ['W', 'kW', 'hp', 'erg']
    }
];

export default function UnitConverterScreen() {
    const navigation = useNavigation();
    const [selectedGroup, setSelectedGroup] = useState(UNIT_GROUPS[0]);
    const [fromUnit, setFromUnit] = useState(UNIT_GROUPS[0].units[0]);
    const [toUnit, setToUnit] = useState(UNIT_GROUPS[0].units[1]);
    const [inputValue, setInputValue] = useState('1');
    const [outputValue, setOutputValue] = useState('');

    useEffect(() => {
        try {
            const val = parseFloat(inputValue);
            if (isNaN(val)) {
                setOutputValue('');
                return;
            }

            const res = unit(val, fromUnit).toNumber(toUnit);
            setOutputValue(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
        } catch (e) {
            setOutputValue('Error');
        }
    }, [inputValue, fromUnit, toUnit]);

    const handleGroupChange = (group: any) => {
        setSelectedGroup(group);
        setFromUnit(group.units[0]);
        setToUnit(group.units[1] || group.units[0]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

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
                <Text style={styles.title}>Unit Converter</Text>
            </View>

            <View style={styles.groupScroller}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {UNIT_GROUPS.map((group) => (
                        <TouchableOpacity
                            key={group.name}
                            onPress={() => handleGroupChange(group)}
                            style={[styles.chip, selectedGroup.name === group.name && styles.activeChip]}
                        >
                            <Text style={[styles.chipText, selectedGroup.name === group.name && styles.activeChipText]}>
                                {group.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                                {selectedGroup.units.map(u => (
                                    <TouchableOpacity
                                        key={u}
                                        onPress={() => setFromUnit(u)}
                                        style={[styles.unitItem, fromUnit === u && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, fromUnit === u && styles.activeUnitItemText]}>{u}</Text>
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
                                {selectedGroup.units.map(u => (
                                    <TouchableOpacity
                                        key={u}
                                        onPress={() => setToUnit(u)}
                                        style={[styles.unitItem, toUnit === u && styles.activeUnitItem]}
                                    >
                                        <Text style={[styles.unitItemText, toUnit === u && styles.activeUnitItemText]}>{u}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
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
    groupScroller: {
        marginBottom: 20,
    },
    chipsContainer: {
        paddingHorizontal: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeChip: {
        backgroundColor: Colors.accent,
        borderColor: Colors.accent,
    },
    chipText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeChipText: {
        color: 'white',
    },
    converterContent: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 15,
        height: 140,
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
    }
});
