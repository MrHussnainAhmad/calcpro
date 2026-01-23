import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
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
// @ts-ignore
import formulas from '../assets/formulas.json';
import { evaluate } from '../lib/math';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Premium Color Palette removed in favor of dynamic theme.

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
    const { theme } = useTheme();
    const getGradient = () => {
        switch (variant) {
            case 'accent': return [theme.accent, theme.accent + '99'];
            case 'orange': return ['#ff9f0a', '#ff7b00'];
            case 'secondary': return [theme.gray, theme.gray];
            default: return [theme.secondary, theme.secondary];
        }
    };

    const textColor = variant === 'orange' || variant === 'accent' ? '#fff' : theme.textPrimary;


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
}) => {
    const { theme } = useTheme();
    return (
        <View style={styles.premiumInputContainer}>
            <View style={styles.premiumInputHeader}>
                <Text style={[styles.premiumInputLabel, { color: theme.textSecondary }]}>{label}</Text>
                <View style={[styles.unitBadge, { backgroundColor: theme.gray }]}>
                    <Text style={[styles.unitBadgeText, { color: theme.textPrimary }]}>{unit}</Text>
                </View>
            </View>

            <View style={styles.premiumInputWrapper}>
                <TextInput
                    style={[styles.premiumInput, { color: theme.textPrimary }]}
                    keyboardType="decimal-pad"
                    placeholder={placeholder}
                    placeholderTextColor={theme.textSecondary}

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
    );
});

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
}) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.chipWrapper, !isLast && styles.chipMargin]}
        >
            {isActive ? (
                <LinearGradient
                    colors={[theme.accent, theme.accent + '99']}
                    style={styles.chipGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.chipTextActive}>{label}</Text>
                </LinearGradient>
            ) : (
                <View style={[styles.chip, { backgroundColor: theme.secondary }]}>
                    <Text style={[styles.chipText, { color: theme.textSecondary }]}>{label}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
});

// Formula Card Component
const FormulaItem = memo(({
    item,
    isFavorite,
    toggleFavorite
}: {
    item: FormulaData;
    isFavorite: boolean;
    toggleFavorite: (id: string) => void;
}) => {
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

    const { theme } = useTheme();
    const isError = result === 'Error' || result === 'Invalid Input';

    return (
        <View style={[styles.card, { backgroundColor: theme.secondary, borderColor: theme.gray }]}>

            {/* Card Header */}
            <TouchableOpacity
                onPress={toggleExpand}
                onLongPress={() => handleCopy(item.expression, 'Formula')}
                delayLongPress={500}
                activeOpacity={0.7}
                style={styles.cardHeader}
            >

                <View style={styles.cardHeaderLeft}>
                    <View style={[styles.cardIcon, { backgroundColor: theme.gray }]}>
                        <Ionicons name="calculator" size={16} color={theme.accent} />
                    </View>
                    <View style={styles.cardHeaderText}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>{item.title}</Text>
                            {copyStatus === 'Formula' && (
                                <Text style={{ marginLeft: 8, color: '#30d158', fontSize: 10, fontWeight: 'bold' }}>Copied!</Text>
                            )}
                        </View>
                        <Text style={[styles.cardFormula, { color: theme.textSecondary }]} numberOfLines={1}>{item.expression}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        style={styles.heartButton}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={20}
                            color={isFavorite ? '#ff453a' : theme.textSecondary}
                        />
                    </TouchableOpacity>
                    <View style={[styles.expandButton, { backgroundColor: expanded ? theme.accent : theme.gray }]}>
                        <Ionicons
                            name={expanded ? "remove" : "add"}
                            size={16}
                            color={expanded ? '#fff' : theme.accent}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Expanded Content */}
            {expanded && (
                <View style={styles.cardBody}>
                    {/* Description */}
                    <View style={styles.descriptionBox}>
                        <Ionicons name="information-circle" size={14} color={theme.accent} />
                        <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
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
                                    <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
                                        {item.output?.label || 'Result'}
                                    </Text>
                                    {copyStatus === 'Result' && (
                                        <Text style={{ marginLeft: 8, color: '#30d158', fontSize: 11, fontWeight: '600' }}>
                                            Copied!
                                        </Text>
                                    )}
                                </View>
                                <Text style={[
                                    styles.resultValue,
                                    { color: isError ? '#ff453a' : '#30d158' }
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
const EmptyState = memo(() => {
    const { theme } = useTheme();
    return (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.secondary }]}>
                <Ionicons name="search-outline" size={40} color={theme.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No formulas found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Try adjusting your search or filters</Text>
        </View>
    );
});

// Main Screen
export default function FormulaScreen({ navigation }: any) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [customFormulas, setCustomFormulas] = useState<FormulaData[]>([]);

    const loadData = useCallback(async () => {
        const [favs, custom] = await Promise.all([
            AsyncStorage.getItem('formula_favs'),
            AsyncStorage.getItem('custom_formulas')
        ]);
        if (favs) setFavorites(JSON.parse(favs));
        if (custom) setCustomFormulas(JSON.parse(custom));
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation, loadData]);

    const allFormulas = useMemo(() => [...formulas, ...customFormulas], [customFormulas]);

    const toggleFavorite = useCallback(async (id: string) => {
        setFavorites(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            AsyncStorage.setItem('formula_favs', JSON.stringify(next));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            return next;
        });
    }, []);

    const allCategories = useMemo(() => {
        const cats = new Set(allFormulas.map((f: FormulaData) => f.category));
        return ['All', 'Favs', ...Array.from(cats)] as string[];
    }, [allFormulas]);

    const getDisplayCategory = useCallback((category: string): string => {
        if (category === 'All') return 'All';
        const match = category.match(/\(([^)]+)\)/);
        return match?.[1] || category;
    }, []);

    const filteredSections = useMemo(() => {
        let data: FormulaData[] = allFormulas;

        if (selectedCategory === 'Favs') {
            data = data.filter(item => favorites.includes(item.id));
        } else if (selectedCategory !== 'All') {
            data = data.filter(item => item.category === selectedCategory);
        }

        const query = debouncedQuery.toLowerCase().trim();
        if (query) {
            data = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        const groups = data.reduce((acc, item) => {
            (acc[item.category] ??= []).push(item);
            return acc;
        }, {} as Record<string, FormulaData[]>);

        return Object.entries(groups).map(([title, items]) => ({ title, data: items }));
    }, [allFormulas, debouncedQuery, selectedCategory, favorites]);

    const renderItem = useCallback(({ item }: { item: FormulaData }) => (
        <FormulaItem
            item={item}
            isFavorite={favorites.includes(item.id)}
            toggleFavorite={toggleFavorite}
        />
    ), [favorites, toggleFavorite]);

    const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    ), []);

    return (
        <View style={[styles.container, { backgroundColor: theme.dark, paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={[styles.backButtonInner, { backgroundColor: theme.secondary }]}>
                        <Ionicons name="chevron-back" size={20} color={theme.accent} />
                    </View>
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Formulas</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{allFormulas.length} available</Text>
                </View>

                <TouchableOpacity
                    style={styles.headerRight}
                    onPress={() => navigation.navigate('AddFormula' as any)}
                >
                    <View style={[styles.headerIcon, { backgroundColor: theme.secondary }]}>
                        <Ionicons name="add" size={24} color={theme.accent} />
                    </View>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                {/* Formula List */}
                <SectionList
                    sections={filteredSections}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    ListHeaderComponent={
                        <>
                            {/* Search Bar */}
                            <View style={styles.searchSection}>
                                <View style={[styles.searchContainer, { backgroundColor: theme.secondary, borderColor: theme.gray }]}>
                                    <Ionicons name="search" size={16} color={theme.textSecondary} />
                                    <TextInput
                                        style={[styles.searchInput, { color: theme.textPrimary }]}
                                        placeholder="Search formulas..."
                                        placeholderTextColor={theme.textSecondary}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        clearButtonMode="while-editing"
                                        returnKeyType="search"
                                    />
                                    {searchQuery.length > 0 && Platform.OS === 'android' && (
                                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                                            <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Calculus Shortcut */}
                            <View style={styles.calculusPromo}>
                                <Text style={[styles.calculusPromoTitle, { color: theme.textSecondary }]}>Get calculus answers better here</Text>
                                <TouchableOpacity
                                    style={styles.calculusButton}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Calculus')}
                                >
                                    <LinearGradient
                                        colors={['#ff9f0a', '#ff7b00']}
                                        style={styles.calculusGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Ionicons name="infinite" size={20} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.calculusButtonText}>Calculus Solver (Derivatives)</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            {/* Linear Algebra Shortcut */}
                            <View style={styles.calculusPromo}>
                                <Text style={[styles.calculusPromoTitle, { color: theme.textSecondary }]}>Solve Linear Algebra Problems</Text>
                                <TouchableOpacity
                                    style={[styles.calculusButton, { borderColor: theme.accent + '33' }]}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Matrix')}
                                >
                                    <LinearGradient
                                        colors={[theme.accent, theme.accent + '99']}
                                        style={styles.calculusGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Ionicons name="grid" size={20} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.calculusButtonText}>Matrix Solver (Determinant, Inverse)</Text>
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
                        </>
                    }
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={EmptyState}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={Platform.OS === 'android'}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    headerSubtitle: {
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
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Search
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        marginLeft: 8,
    },

    // Chips - FIXED
    chipsScrollView: {
        flexGrow: 0,
        flexShrink: 0,
        marginBottom: 0,
    },
    chipsContainer: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 0,
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
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    chipGradient: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    chipText: {
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
        marginTop: 0,
        marginBottom: 6,
    },
    sectionDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Card
    card: {
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
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
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardFormula: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    expandButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    heartButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
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
        fontSize: 13,
        fontWeight: '500',
    },
    unitBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    unitBadgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    premiumInputWrapper: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    premiumInput: {
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
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    emptySubtitle: {
        fontSize: 14,
        marginTop: 4,
    },

    // Calculus Promo
    calculusPromo: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    calculusPromoTitle: {
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