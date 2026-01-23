import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { evaluate } from '../lib/math';
import Svg, { Path, G, Line, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLOT_SIZE = SCREEN_WIDTH - 40;
const PADDING = 20;

export default function GraphScreen() {
    const navigation = useNavigation();
    const [expression, setExpression] = useState('x^2');
    const [expression2, setExpression2] = useState('');
    const [range, setRange] = useState({ min: -10, max: 10 });
    const [showTable, setShowTable] = useState(false);

    const points = useMemo(() => {
        const plotPoints: { x: number; y: number }[] = [];
        const step = (range.max - range.min) / 100;
        try {
            for (let x = range.min; x <= range.max; x += step) {
                const y = evaluate(expression, { x });
                if (typeof y === 'number' && isFinite(y)) plotPoints.push({ x, y });
            }
        } catch (e) { return []; }
        return plotPoints;
    }, [expression, range]);

    const points2 = useMemo(() => {
        if (!expression2.trim()) return [];
        const plotPoints: { x: number; y: number }[] = [];
        const step = (range.max - range.min) / 100;
        try {
            for (let x = range.min; x <= range.max; x += step) {
                const y = evaluate(expression2, { x });
                if (typeof y === 'number' && isFinite(y)) plotPoints.push({ x, y });
            }
        } catch (e) { return []; }
        return plotPoints;
    }, [expression2, range]);

    const scale = useMemo(() => {
        const allPoints = [...points, ...points2];
        if (allPoints.length === 0) return { x: 1, y: 1, yMin: -10, yMax: 10 };

        const yValues = allPoints.map(p => p.y);
        const yMin = Math.min(...yValues, -1);
        const yMax = Math.max(...yValues, 1);

        return {
            x: PLOT_SIZE / (range.max - range.min),
            y: PLOT_SIZE / (yMax - yMin),
            yMin,
            yMax
        };
    }, [points, points2, range]);

    const pathData = useMemo(() => {
        if (points.length < 2) return '';
        return points.map((p, i) => {
            const screenX = (p.x - range.min) * scale.x;
            const screenY = PLOT_SIZE - (p.y - scale.yMin) * scale.y;
            return `${i === 0 ? 'M' : 'L'} ${screenX} ${screenY}`;
        }).join(' ');
    }, [points, scale, range]);

    const pathData2 = useMemo(() => {
        if (points2.length < 2) return '';
        return points2.map((p, i) => {
            const screenX = (p.x - range.min) * scale.x;
            const screenY = PLOT_SIZE - (p.y - scale.yMin) * scale.y;
            return `${i === 0 ? 'M' : 'L'} ${screenX} ${screenY}`;
        }).join(' ');
    }, [points2, scale, range]);

    const xAxisY = PLOT_SIZE - (0 - scale.yMin) * scale.y;
    const yAxisX = (0 - range.min) * scale.x;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                </TouchableOpacity>
                <Text style={styles.title}>Graphing Engine</Text>
            </View>

            <View style={styles.inputCard}>
                <View style={styles.inputGroup}>
                    <View style={[styles.colorDot, { backgroundColor: Colors.accent }]} />
                    <TextInput
                        style={styles.input}
                        value={expression}
                        onChangeText={setExpression}
                        placeholder="Function 1 (e.g. x^2)"
                        placeholderTextColor={Colors.gray}
                        autoCapitalize="none"
                    />
                </View>
                <View style={[styles.inputGroup, { marginTop: 10 }]}>
                    <View style={[styles.colorDot, { backgroundColor: '#FF9500' }]} />
                    <TextInput
                        style={styles.input}
                        value={expression2}
                        onChangeText={setExpression2}
                        placeholder="Function 2 (optional)"
                        placeholderTextColor={Colors.gray}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.rangeRow}>
                    <View style={styles.rangeCol}>
                        <Text style={styles.label}>X Min:</Text>
                        <TextInput
                            style={styles.smallInput}
                            value={range.min.toString()}
                            onChangeText={(v) => setRange(r => ({ ...r, min: parseFloat(v) || 0 }))}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.rangeCol}>
                        <Text style={styles.label}>X Max:</Text>
                        <TextInput
                            style={styles.smallInput}
                            value={range.max.toString()}
                            onChangeText={(v) => setRange(r => ({ ...r, max: parseFloat(v) || 0 }))}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.graphContainer}>
                <Svg width={PLOT_SIZE} height={PLOT_SIZE} style={styles.svg}>
                    <G>
                        {/* Grid & Axes */}
                        <Line x1="0" y1={xAxisY} x2={PLOT_SIZE} y2={xAxisY} stroke={Colors.gray} strokeWidth="1" />
                        <Line x1={yAxisX} y1="0" x2={yAxisX} y2={PLOT_SIZE} stroke={Colors.gray} strokeWidth="1" />

                        {/* Function Path 1 */}
                        <Path
                            d={pathData}
                            fill="none"
                            stroke={Colors.accent}
                            strokeWidth="3"
                        />
                        {/* Function Path 2 */}
                        <Path
                            d={pathData2}
                            fill="none"
                            stroke="#FF9500"
                            strokeWidth="3"
                        />
                    </G>
                </Svg>

                <View style={styles.controlsRow}>
                    <View style={styles.legend}>
                        <Text style={styles.legendText}>y1={expression}</Text>
                        {expression2 ? <Text style={[styles.legendText, { color: '#FF9500', marginLeft: 10 }]}>y2={expression2}</Text> : null}
                    </View>
                    <TouchableOpacity style={styles.tableBtn} onPress={() => setShowTable(!showTable)}>
                        <Ionicons name={showTable ? "stats-chart" : "list"} size={20} color="white" />
                        <Text style={styles.tableBtnText}>{showTable ? "View Graph" : "Data Table"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showTable ? (
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>x</Text>
                        <Text style={styles.tableColHeader}>y1</Text>
                        {expression2 ? <Text style={styles.tableColHeader}>y2</Text> : null}
                    </View>
                    <ScrollView>
                        {points.filter((_, i) => i % 5 === 0).map((p, i) => {
                            const p2 = points2.find(pt => Math.abs(pt.x - p.x) < 0.001);
                            return (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{p.x.toFixed(2)}</Text>
                                    <Text style={[styles.tableCell, { color: Colors.accent }]}>{p.y.toFixed(2)}</Text>
                                    {expression2 ? (
                                        <Text style={[styles.tableCell, { color: '#FF9500' }]}>
                                            {p2 ? p2.y.toFixed(2) : '-'}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.guide}>
                    <Text style={styles.guideTitle}>Tips:</Text>
                    <Text style={styles.guideText}>• Try common functions: `sin(x)`, `cos(x)`, `abs(x)`, `log(x)`</Text>
                    <Text style={styles.guideText}>• Use `*` for multiplication: `2 * x`</Text>
                    <Text style={styles.guideText}>• Adjust X-range to zoom in or out.</Text>
                </View>
            )}
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
    inputCard: {
        backgroundColor: Colors.secondary,
        margin: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: Colors.dark,
        color: 'white',
        padding: 12,
        borderRadius: 10,
        fontSize: 18,
        flex: 1,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    rangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rangeCol: {
        width: '45%',
    },
    smallInput: {
        backgroundColor: Colors.dark,
        color: 'white',
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
        textAlign: 'center',
    },
    graphContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    svg: {
        backgroundColor: '#0A0A0A',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    legend: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        flexDirection: 'row',
        flex: 1,
    },
    legendText: {
        color: Colors.accent,
        fontFamily: 'monospace',
        fontSize: 12,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    tableBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tableBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    tableContainer: {
        flex: 1,
        margin: 20,
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: 10,
    },
    tableColHeader: {
        flex: 1,
        color: Colors.accent,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tableCell: {
        flex: 1,
        color: 'white',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 13,
    },
    guide: {
        flex: 1,
        padding: 20,
    },
    guideTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    guideText: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    }
});
