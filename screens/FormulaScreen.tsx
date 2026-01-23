import React, { useState, useMemo, useCallback, memo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SectionList,
    ScrollView,
    LayoutAnimation,
    UIManager,
    Dimensions,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
// @ts-ignore
import { formulas } from '../assets/data';
import { evaluate } from 'mathjs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Premium Color Palette
const COLORS = {
    bg: '#000000',
    card: '#1c1c1e',
    cardBorder: 'rgba(255,255,255,0.08)',
    accent: '#0a84ff',
    accentGradient: ['#0a84ff', '#0066cc'],
    orange: '#ff9f0a',
    orangeGradient: ['#ff9f0a', '#ff7b00'],
    green: '#30d158',
    greenGradient: ['#30d158', '#28a745'],
    red: '#ff453a',
    gray1: '#8e8e93',
    gray2: '#636366',
    gray3: '#48484a',
    gray4: '#3a3a3c',
    gray5: '#2c2c2e',
    gray6: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#8e8e93',
};

interface InputDef {
    key: string;
    label: string;
    unit: string;
}

interface FormulaData {
    id: string;
    title: string;
    expression: string;
    description: string;
    category: string;
    inputs: InputDef[];
    output?: { label?: string; unit?: string };
}

// Calculator-style Button Component
const CalcButton = memo(({
    onPress,
    label,
    variant = 'default',
    icon,
    flex = 1
}: {
    onPress: () => void;
    label?: string;
    variant?: 'default' | 'accent' | 'orange' | 'secondary';
    icon?: string;
    flex?: number;
}) => {
    const getGradient = () => {
        switch (variant) {
            case 'accent': return COLORS.accentGradient;
            case 'orange': return COLORS.orangeGradient;
            case 'secondary': return [COLORS.gray4, COLORS.gray5];
            default: return [COLORS.gray5, COLORS.gray6];
        }
    };

    const textColor = variant === 'orange' || variant === 'accent' ? '#fff' : COLORS.text;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            style={[styles.calcButton, { flex }]}
        >
            <LinearGradient
                colors={getGradient() as [string, string]}
                style={styles.calcButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {icon ? (
                    <Ionicons name={icon as any} size={18} color={textColor} />
                ) : null}
                {label ? (
                    <Text style={[styles.calcButtonText, { color: textColor }]}>
                        {label}
                    </Text>
                ) : null}
            </LinearGradient>
        </TouchableOpacity>
    );
});

// Premium Input Field - FIXED (no history/autofill)
const PremiumInput = memo(({
    label,
    unit,
    value,
    onChangeText,
    placeholder
}: {
    label: string;
    unit: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}) => (
    <View style={styles.premiumInputContainer}>
        <View style={styles.premiumInputHeader}>
            <Text style={styles.premiumInputLabel}>{label}</Text>
            <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>{unit}</Text>
            </View>
        </View>
        <View style={styles.premiumInputWrapper}>
            <TextInput
                style={styles.premiumInput}
                keyboardType="decimal-pad"
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray2}
                value={value}
                onChangeText={onChangeText}
                // Disable history/autofill
                autoComplete="off"
                autoCorrect={false}
                textContentType="none"
                importantForAutofill="no"
                dataDetectorTypes="none"
            />
        </View>
    </View>
));

// Category Chip - FIXED
const CategoryChip = memo(({
    label,
    isActive,
    onPress,
    isLast = false
}: {
    label: string;
    isActive: boolean;
    onPress: () => void;
    isLast?: boolean;
}) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.chipWrapper, !isLast && styles.chipMargin]}
    >
        {isActive ? (
            <LinearGradient
                colors={COLORS.accentGradient as [string, string]}
                style={styles.chipGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.chipTextActive}>{label}</Text>
            </LinearGradient>
        ) : (
            <View style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
            </View>
        )}
    </TouchableOpacity>
));

// Formula Card Component
const FormulaItem = memo(({ item }: { item: FormulaData }) => {
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [result, setResult] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const handleCopy = useCallback(async (text: string | null, label: string) => {
        if (!text) return;
        await Clipboard.setStringAsync(text);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCopyStatus(label);
        setTimeout(() => setCopyStatus(null), 2000);
    }, []);

    const toggleExpand = useCallback(() => {
        LayoutAnimation.configureNext({
            duration: 300,
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });
        setExpanded(prev => !prev);
    }, []);

    const updateInput = useCallback((key: string, value: string) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleCalculate = useCallback(() => {
        try {
            const scope: Record<string, number> = {};
            for (const { key } of item.inputs) {
                const val = parseFloat(inputs[key]);
                if (isNaN(val)) {
                    setResult('Invalid Input');
                    return;
                }
                scope[key] = val;
            }
            const res = evaluate(item.expression, scope);
            const formatted = typeof res === 'number'
                ? `${res.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${item.output?.unit || ''}`.trim()
                : res.toString();
            setResult(formatted);
        } catch {
            setResult('Error');
        }
    }, [inputs, item]);

    const handleClear = useCallback(() => {
        setInputs({});
        setResult(null);
    }, []);

    const isError = result === 'Error' || result === 'Invalid Input';

    return (
        <View style={styles.card}>
            {/* Card Header */}
            <TouchableOpacity
                onPress={toggleExpand}
                onLongPress={() => handleCopy(item.expression, 'Formula')}
                delayLongPress={500}
                activeOpacity={0.7}
                style={styles.cardHeader}
            >

                <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="calculator" size={16} color={COLORS.orange} />
                    </View>
                    <View style={styles.cardHeaderText}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                            {copyStatus === 'Formula' && (
                                <Text style={{ marginLeft: 8, color: COLORS.green, fontSize: 10, fontWeight: 'bold' }}>Copied!</Text>
                            )}
                        </View>
                        <Text style={styles.cardFormula} numberOfLines={1}>{item.expression}</Text>
                    </View>
                </View>
                <View style={[styles.expandButton, expanded && styles.expandButtonActive]}>
                    <Ionicons
                        name={expanded ? "remove" : "add"}
                        size={16}
                        color={expanded ? COLORS.text : COLORS.accent}
                    />
                </View>
            </TouchableOpacity>

            {/* Expanded Content */}
            {expanded && (
                <View style={styles.cardBody}>
                    {/* Description */}
                    <View style={styles.descriptionBox}>
                        <Ionicons name="information-circle" size={14} color={COLORS.accent} />
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputsGrid}>
                        {item.inputs.map(({ key, label, unit }) => (
                            <PremiumInput
                                key={key}
                                label={label}
                                unit={unit}
                                value={inputs[key] || ''}
                                onChangeText={text => updateInput(key, text)}
                                placeholder="0"
                            />
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <CalcButton
                            onPress={handleClear}
                            label="Clear"
                            icon="refresh"
                            variant="secondary"
                        />
                        <View style={styles.buttonSpacer} />
                        <CalcButton
                            onPress={handleCalculate}
                            label="Calculate"
                            icon="play"
                            variant="orange"
                            flex={2}
                        />
                    </View>

                    {/* Result Display */}
                    {result && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => !isError && handleCopy(result, 'Result')}
                            style={styles.resultDisplay}
                        >
                            <LinearGradient
                                colors={isError
                                    ? ['rgba(255,69,58,0.15)', 'rgba(255,69,58,0.05)']
                                    : ['rgba(48,209,88,0.15)', 'rgba(48,209,88,0.05)']
                                }
                                style={[
                                    styles.resultGradient,
                                    isError && styles.resultGradientError
                                ]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Text style={styles.resultLabel}>
                                        {item.output?.label || 'Result'}
                                    </Text>
                                    {copyStatus === 'Result' && (
                                        <Text style={{ marginLeft: 8, color: COLORS.green, fontSize: 11, fontWeight: '600' }}>
                                            Copied!
                                        </Text>
                                    )}
                                </View>
                                <Text style={[
                                    styles.resultValue,
                                    isError && styles.resultValueError
                                ]}>
                                    {result}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
});

// Empty State
const EmptyState = memo(() => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
            <Ionicons name="search-outline" size={40} color={COLORS.gray2} />
        </View>
        <Text style={styles.emptyTitle}>No formulas found</Text>
        <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
    </View>
));

// Main Screen
export default function FormulaScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const allCategories = useMemo(() => {
        const cats = new Set(formulas.map((f: FormulaData) => f.category));
        return ['All', ...Array.from(cats)] as string[];
    }, []);

    const getDisplayCategory = useCallback((category: string): string => {
        if (category === 'All') return 'All';
        const match = category.match(/\(([^)]+)\)/);
        return match?.[1] || category;
    }, []);

    const filteredSections = useMemo(() => {
        let data: FormulaData[] = formulas;

        if (selectedCategory !== 'All') {
            data = data.filter(item => item.category === selectedCategory);
        }

        const query = searchQuery.toLowerCase().trim();
        if (query) {
            data = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }

        const groups = data.reduce((acc, item) => {
            (acc[item.category] ??= []).push(item);
            return acc;
        }, {} as Record<string, FormulaData[]>);

        return Object.entries(groups).map(([title, items]) => ({ title, data: items }));
    }, [searchQuery, selectedCategory]);

    const renderItem = useCallback(({ item }: { item: FormulaData }) => (
        <FormulaItem item={item} />
    ), []);

    const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    ), []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={styles.backButtonInner}>
                        <Ionicons name="chevron-back" size={20} color={COLORS.accent} />
                    </View>
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Formulas</Text>
                    <Text style={styles.headerSubtitle}>{formulas.length} available</Text>
                </View>

                <View style={styles.headerRight}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="flask" size={18} color={COLORS.orange} />
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={16} color={COLORS.gray1} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search formulas..."
                            placeholderTextColor={COLORS.gray2}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            clearButtonMode="while-editing"
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && Platform.OS === 'android' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={16} color={COLORS.gray2} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Calculus Shortcut */}
                <View style={styles.calculusPromo}>
                    <Text style={styles.calculusPromoTitle}>Get calculus answers better here</Text>
                    <TouchableOpacity
                        style={styles.calculusButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Calculus')}
                    >
                        <LinearGradient
                            colors={COLORS.orangeGradient as [string, string]}
                            style={styles.calculusGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="infinite" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.calculusButtonText}>Calculus Solver (Derivatives)</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Filter Chips - FIXED */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}
                    style={styles.chipsScrollView}
                >
                    {allCategories.map((category, index) => (
                        <CategoryChip
                            key={category}
                            label={getDisplayCategory(category)}
                            isActive={selectedCategory === category}
                            onPress={() => setSelectedCategory(category)}
                            isLast={index === allCategories.length - 1}
                        />
                    ))}
                </ScrollView>

                {/* Formula List */}
                <SectionList
                    sections={filteredSections}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={EmptyState}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
    },
    backButtonInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.gray5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 17,
        fontWeight: '600',
    },
    headerSubtitle: {
        color: COLORS.gray1,
        fontSize: 11,
        marginTop: 2,
    },
    headerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,159,10,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Search
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray6,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 40,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    searchInput: {
        flex: 1,
        color: COLORS.text,
        fontSize: 15,
        marginLeft: 8,
    },

    // Chips - FIXED
    chipsScrollView: {
        flexGrow: 0,
        flexShrink: 0,
        marginBottom: 8,
    },
    chipsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipWrapper: {
        flexShrink: 0,
    },
    chipMargin: {
        marginRight: 10,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.gray5,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    chipGradient: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    chipText: {
        color: COLORS.gray1,
        fontSize: 13,
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    sectionDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.orange,
        marginRight: 8,
    },
    sectionTitle: {
        color: COLORS.gray1,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,159,10,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardFormula: {
        color: COLORS.accent,
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    expandButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(10,132,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    expandButtonActive: {
        backgroundColor: COLORS.accent,
    },

    // Card Body
    cardBody: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 4,
    },
    descriptionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(10,132,255,0.08)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
        marginLeft: 8,
    },

    // Premium Inputs
    inputsGrid: {
        marginBottom: 16,
    },
    premiumInputContainer: {
        marginBottom: 12,
    },
    premiumInputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    premiumInputLabel: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: '500',
    },
    unitBadge: {
        backgroundColor: COLORS.gray4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    unitBadgeText: {
        color: COLORS.gray1,
        fontSize: 10,
        fontWeight: '600',
    },
    premiumInputWrapper: {
        backgroundColor: COLORS.gray5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
    },
    premiumInput: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '500',
        paddingHorizontal: 16,
        paddingVertical: 14,
        textAlign: 'right',
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    buttonSpacer: {
        width: 12,
    },
    calcButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    calcButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    calcButtonText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Result Display
    resultDisplay: {
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    resultGradient: {
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(48,209,88,0.2)',
        borderRadius: 16,
    },
    resultGradientError: {
        borderColor: 'rgba(255,69,58,0.2)',
    },
    resultLabel: {
        color: COLORS.gray1,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    resultValue: {
        color: COLORS.green,
        fontSize: 32,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
    },
    resultValueError: {
        color: COLORS.red,
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.gray5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: 17,
        fontWeight: '600',
    },
    emptySubtitle: {
        color: COLORS.gray1,
        fontSize: 14,
        marginTop: 4,
    },

    // Calculus Promo
    calculusPromo: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    calculusPromoTitle: {
        color: COLORS.gray1,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    calculusButton: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,159,10,0.3)',
    },
    calculusGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    calculusButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});