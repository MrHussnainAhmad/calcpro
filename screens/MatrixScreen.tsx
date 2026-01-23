import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { det, inv, transpose } from '../lib/math';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

type MatrixSize = 2 | 3;

export default function MatrixScreen() {
    const navigation = useNavigation();
    const [size, setSize] = useState<MatrixSize>(2);
    const [matrix, setMatrix] = useState<string[][]>([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (row: number, col: number, value: string) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = value;
        setMatrix(newMatrix);
    };

    const getMatrixData = () => {
        const data: number[][] = [];
        for (let i = 0; i < size; i++) {
            const row: number[] = [];
            for (let j = 0; j < size; j++) {
                const val = parseFloat(matrix[i][j]);
                if (isNaN(val)) throw new Error('Fill all fields with numbers');
                row.push(val);
            }
            data.push(row);
        }
        return data;
    };

    const runOp = (op: string) => {
        try {
            const data = getMatrixData();
            let res: any;
            switch (op) {
                case 'det':
                    res = det(data);
                    break;
                case 'inv':
                    res = inv(data);
                    break;
                case 'trans':
                    res = transpose(data);
                    break;
            }

            if (Array.isArray(res)) {
                // Format matrix result
                const formatted = res.map((row: any[]) =>
                    `[${row.map((n: any) => typeof n === 'number' ? n.toFixed(2) : n).join(', ')}]`
                ).join('\n');
                setResult(formatted);
            } else {
                setResult(res.toString());
            }
            setError(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            setResult(null);
            setError(e.message || 'Error occurred');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Matrix Solver</Text>
            </View>

            <View style={styles.sizeToggle}>
                <TouchableOpacity
                    style={[styles.sizeBtn, size === 2 && styles.activeSize]}
                    onPress={() => setSize(2)}
                >
                    <Text style={[styles.sizeText, size === 2 && styles.activeSizeText]}>2 x 2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sizeBtn, size === 3 && styles.activeSize]}
                    onPress={() => setSize(3)}
                >
                    <Text style={[styles.sizeText, size === 3 && styles.activeSizeText]}>3 x 3</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.matrixCard}>
                    {Array.from({ length: size }).map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {Array.from({ length: size }).map((_, colIndex) => (
                                <TextInput
                                    key={colIndex}
                                    style={styles.matrixInput}
                                    keyboardType="numeric"
                                    value={matrix[rowIndex][colIndex]}
                                    onChangeText={(val) => handleInputChange(rowIndex, colIndex, val)}
                                    placeholder="0"
                                    placeholderTextColor={Colors.gray}
                                />
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.opBtn} onPress={() => runOp('det')}>
                        <Text style={styles.opText}>Determinant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.opBtn} onPress={() => runOp('inv')}>
                        <Text style={styles.opText}>Inverse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.opBtn} onPress={() => runOp('trans')}>
                        <Text style={styles.opText}>Transpose</Text>
                    </TouchableOpacity>
                </View>

                {result && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Result:</Text>
                        <Text style={styles.resultValue}>{result}</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
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
        color: Colors.textPrimary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    sizeToggle: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 4,
    },
    sizeBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeSize: {
        backgroundColor: Colors.accent,
    },
    sizeText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    activeSizeText: {
        color: 'white',
    },
    content: {
        padding: 20,
    },
    matrixCard: {
        backgroundColor: Colors.secondary,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    matrixInput: {
        width: 60,
        height: 50,
        backgroundColor: Colors.dark,
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    opBtn: {
        width: '31%',
        backgroundColor: Colors.gray,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    opText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    resultCard: {
        marginTop: 20,
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
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    resultValue: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'monospace',
        lineHeight: 24,
    },
    errorCard: {
        marginTop: 20,
        backgroundColor: '#CF6679',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
