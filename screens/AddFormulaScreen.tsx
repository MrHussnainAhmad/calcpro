import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function AddFormulaScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('My Formulas');
    const [description, setDescription] = useState('');
    const [expression, setExpression] = useState('');
    const [inputs, setInputs] = useState([{ label: 'X Value', key: 'x', unit: '' }]);

    const addInput = () => {
        setInputs([...inputs, { label: '', key: '', unit: '' }]);
    };

    const removeInput = (index: number) => {
        const newInputs = inputs.filter((_, i) => i !== index);
        setInputs(newInputs);
    };

    const updateInput = (index: number, field: string, value: string) => {
        const newInputs = [...inputs];
        (newInputs[index] as any)[field] = value;
        setInputs(newInputs);
    };

    const saveFormula = async () => {
        if (!title || !expression || inputs.some(i => !i.label || !i.key)) {
            Alert.alert('Missing Info', 'Please fill in the title, expression, and all input fields.');
            return;
        }

        try {
            const newFormula = {
                id: `custom_${Date.now()}`,
                title,
                category,
                description,
                expression,
                inputs,
                isCustom: true
            };

            const existing = await AsyncStorage.getItem('custom_formulas');
            const formulas = existing ? JSON.parse(existing) : [];
            formulas.push(newFormula);
            await AsyncStorage.setItem('custom_formulas', JSON.stringify(formulas));

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Could not save formula.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.accent} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textPrimary }]}>New Custom Formula</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={[styles.card, { backgroundColor: theme.secondary }]}>
                        <Text style={[styles.label, { color: theme.accent }]}>Formula Title</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g., My Lab Formula"
                            placeholderTextColor={theme.textSecondary}
                        />

                        <Text style={[styles.label, { color: theme.accent }]}>Category</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                            value={category}
                            onChangeText={setCategory}
                            placeholder="e.g., Physics Lab"
                            placeholderTextColor={theme.textSecondary}
                        />

                        <Text style={[styles.label, { color: theme.accent }]}>Math Expression</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                            value={expression}
                            onChangeText={setExpression}
                            placeholder="e.g., a * x^2 + b"
                            placeholderTextColor={theme.textSecondary}
                            autoCapitalize="none"
                        />
                        <Text style={[styles.hint, { color: theme.textSecondary }]}>Use variables you define below (x, a, b...)</Text>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Variables / Inputs</Text>
                        <TouchableOpacity onPress={addInput} style={styles.addBtn}>
                            <Ionicons name="add-circle" size={20} color={theme.accent} />
                            <Text style={[styles.addBtnText, { color: theme.accent }]}>Add Variable</Text>
                        </TouchableOpacity>
                    </View>

                    {inputs.map((input, index) => (
                        <View key={index} style={[styles.inputCard, { backgroundColor: theme.secondary }]}>
                            <View style={styles.inputRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Display Label</Text>
                                    <TextInput
                                        style={[styles.smallInput, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                        value={input.label}
                                        onChangeText={(v) => updateInput(index, 'label', v)}
                                        placeholder="Mass"
                                        placeholderTextColor={theme.textSecondary}
                                    />
                                </View>
                                <View style={{ width: 80, marginLeft: 10 }}>
                                    <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Var Key</Text>
                                    <TextInput
                                        style={[styles.smallInput, { backgroundColor: theme.dark, color: theme.textPrimary }]}
                                        value={input.key}
                                        onChangeText={(v) => updateInput(index, 'key', v)}
                                        placeholder="m"
                                        placeholderTextColor={theme.textSecondary}
                                        autoCapitalize="none"
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeInput(index)}
                                    style={styles.removeBtn}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF453A" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={saveFormula}>
                        <Text style={styles.saveBtnText}>Save Formula</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: { marginRight: 10 },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    card: {
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    hint: {
        fontSize: 11,
        fontStyle: 'italic',
        marginTop: -10,
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addBtnText: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    inputCard: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    subLabel: {
        fontSize: 10,
        marginBottom: 5,
    },
    smallInput: {
        padding: 8,
        borderRadius: 8,
        fontSize: 14,
    },
    removeBtn: {
        marginLeft: 10,
        padding: 5,
    },
    saveBtn: {
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    saveBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
