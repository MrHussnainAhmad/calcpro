import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Helper to get currency name
const getCurrencyName = (code: string) => {
    try {
        return new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code;
    } catch (e) {
        return code;
    }
};

// Simplified flag mapping for common currencies + heuristic
// We can't map all 150+ perfectly without a massive library, but we can catch the big ones
// and fall back to empty string (or a generic globe?) for others.
const getFlag = (code: string) => {
    const manualMap: Record<string, string> = {
        USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', CNY: '🇨🇳',
        INR: '🇮🇳', AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', SGD: '🇸🇬',
        HKD: '🇭🇰', NZD: '🇳🇿', KRW: '🇰🇷', MXN: '🇲🇽', BRL: '🇧🇷',
        ZAR: '🇿🇦', RUB: '🇷🇺', AED: '🇦🇪', SAR: '🇸🇦', PKR: '🇵🇰',
        TRY: '🇹🇷', SEK: '🇸🇪', NOK: '🇳🇴', DKK: '🇩🇰', PLN: '🇵🇱',
        THB: '🇹🇭', MYR: '🇲🇾', IDR: '🇮🇩', PHP: '🇵🇭', VND: '🇻🇳',
        EGP: '🇪🇬', NGN: '🇳🇬', ARS: '🇦🇷', CLP: '🇨🇱', COP: '🇨🇴',
        PEN: '🇵🇪', ILS: '🇮🇱', CZK: '🇨🇿', HUF: '🇭🇺', RON: '🇷🇴',
        BGN: '🇧🇬', HRK: '🇭🇷', UAH: '🇺🇦', KWD: '🇰🇼', QAR: '🇶🇦',
        BHD: '🇧🇭', OMR: '🇴🇲', JOD: '🇯🇴', LBP: '🇱🇧', KES: '🇰🇪',
        GHS: '🇬🇭', MAD: '🇲🇦', TND: '🇹🇳', LKR: '🇱🇰', BDT: '🇧🇩',
        NPR: '🇳🇵', AFN: '🇦🇫', MMK: '🇲🇲', KZT: '🇰🇿', UZS: '🇺🇿',
        AZN: '🇦🇿', GEL: '🇬🇪', AMD: '🇦🇲', TWD: '🇹🇼'
    };
    if (manualMap[code]) return manualMap[code];

    // Fallback: try to match first 2 letters to regional indicator symbols
    // This works for many (e.g. CA-D => CA => 🇨🇦, AU-D => AU => 🇦🇺)
    // but fails for others (e.g. CH-F => CH => 🇨🇭 (Switzerland works!), MX-N => MX => 🇲🇽)
    // It's a surprisingly good heuristic for currency codes derived from ISO country codes.
    const countryCode = code.slice(0, 2).toUpperCase();
    if (countryCode.match(/^[A-Z]{2}$/)) {
        const codePoints = countryCode
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    return '🏳️';
};

// Memoized Item Component for performance
const CurrencyItem = React.memo(({ item, isActive, onPress }: { item: any, isActive: boolean, onPress: (item: any) => void }) => (
    <TouchableOpacity
        onPress={() => onPress(item)}
        style={[styles.currencyItem, isActive && styles.activeCurrencyItem]}
    >
        <Text style={styles.currencyFlag}>{item.flag}</Text>
        <Text style={[styles.currencyItemText, isActive && styles.activeCurrencyItemText]}>
            {item.code}
        </Text>
    </TouchableOpacity>
));

export default function CurrencyConversionScreen() {
    const navigation = useNavigation();

    // Initial dummy data to render something immediately
    const [currencyList, setCurrencyList] = useState<any[]>([
        { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    ]);

    const [fromCurrency, setFromCurrency] = useState(currencyList[0]);
    const [toCurrency, setToCurrency] = useState(currencyList[1]);
    const [inputValue, setInputValue] = useState('1');
    const [outputValue, setOutputValue] = useState('');
    const [exchangeRates, setExchangeRates] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    // Search states
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    // Filtered lists
    const filteredFromList = useMemo(() => {
        if (!searchFrom) return currencyList;
        const q = searchFrom.toLowerCase();
        return currencyList.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
        );
    }, [currencyList, searchFrom]);

    const filteredToList = useMemo(() => {
        if (!searchTo) return currencyList;
        const q = searchTo.toLowerCase();
        return currencyList.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
        );
    }, [currencyList, searchTo]);

    useEffect(() => {
        if (exchangeRates && exchangeRates.rates) {
            convertCurrency();

            // If currency list was just updated, ensure selected currencies are valid
            // validation logic is inherently handled because we only set from/to from the list
            // but we might want to preserve selection if possible or default to safe ones
        }
    }, [inputValue, fromCurrency, toCurrency, exchangeRates]);

    const fetchExchangeRates = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch from custom backend
            const response = await fetch('https://app-backend-pgf9.vercel.app/p/general/exchange-rates');

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();

            // Transform array response to object format: { rates: { USD: 1, EUR: 0.92, ... } }
            const rates: Record<string, number> = {};
            const newCurrencyList: any[] = [];
            let latestTimestamp = 0;

            if (Array.isArray(data)) {
                data.forEach((item: any) => {
                    if (item.currency && item.rate) {
                        rates[item.currency] = item.rate;

                        // Build currency object
                        newCurrencyList.push({
                            code: item.currency,
                            name: getCurrencyName(item.currency),
                            flag: getFlag(item.currency)
                        });

                        // Track latest update time
                        const itemTime = new Date(item.lastUpdated || item.createdAt).getTime();
                        if (itemTime > latestTimestamp) latestTimestamp = itemTime;
                    }
                });

                // Sort by code
                newCurrencyList.sort((a, b) => a.code.localeCompare(b.code));

                setCurrencyList(newCurrencyList);

                // Set default selection if not already set or invalid
                // Try to find USD and EUR, or fallback to first two
                const usd = newCurrencyList.find(c => c.code === 'USD') || newCurrencyList[0];
                const eur = newCurrencyList.find(c => c.code === 'EUR') || newCurrencyList[1] || newCurrencyList[0];

                // Only reset if we don't have rates yet, or if current selection is invalid
                if (!exchangeRates) {
                    setFromCurrency(usd);
                    setToCurrency(eur);
                }

            } else {
                throw new Error('Invalid API response format');
            }

            setExchangeRates({ rates });

            const updateDate = latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();
            setLastUpdate(updateDate.toLocaleString());

            setLoading(false);
        } catch (e) {
            setError('Failed to fetch rates. Using offline mode.');
            setLoading(false);

            // Build offline list from fallback codes (subset of 150+, just the majors)
            const fallbackRates = {
                USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24,
                INR: 83.12, AUD: 1.52, CAD: 1.36, CHF: 0.88, SGD: 1.34,
                HKD: 7.83, NZD: 1.65, KRW: 1329, MXN: 17.1, BRL: 4.97,
                ZAR: 18.8, RUB: 92.5, AED: 3.67, SAR: 3.75, PKR: 278
            };

            const offlineList = Object.keys(fallbackRates).map(code => ({
                code,
                name: getCurrencyName(code),
                flag: getFlag(code)
            })).sort((a, b) => a.code.localeCompare(b.code));

            setCurrencyList(offlineList);
            setExchangeRates({ rates: fallbackRates });

            // Reset selection to safe defaults
            setFromCurrency(offlineList.find(c => c.code === 'USD')!);
            setToCurrency(offlineList.find(c => c.code === 'EUR')!);
        }
    };

    const convertCurrency = () => {
        try {
            const val = parseFloat(inputValue);
            if (isNaN(val)) {
                setOutputValue('');
                return;
            }

            // Convert to USD first (base is assumed USD=1 in the rates map if derived from USD base,
            // BUT wait, does the custom API return rates relative to USD?
            // Looking at the data: USD rate is 1. AED is 3.67. This implies USD base.
            // If the base changes, this logic needs update. Assuming USD base for now based on data.)

            // Logic: amount / fromRate * toRate
            // Example: 100 AED -> USD: 100 / 3.67 = 27.2 USD
            // 27.2 USD -> EUR: 27.2 * 0.92 = 25 EUR

            const fromRate = exchangeRates?.rates?.[fromCurrency.code];
            const toRate = exchangeRates?.rates?.[toCurrency.code];

            if (!fromRate || !toRate) {
                setOutputValue('---');
                return;
            }

            const usdValue = val / fromRate;
            const result = usdValue * toRate;

            setOutputValue(result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        } catch (e) {
            setOutputValue('Error');
        }
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const refreshRates = () => {
        fetchExchangeRates();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    if (loading && !exchangeRates) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={styles.loadingText}>WE PAY, FOR YOU!</Text>
                    <Text style={styles.loadingText}>Fetching 150+ currencies...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Render Item for FlatList
    const renderCurrencyItemFrom = ({ item }: any) => (
        <CurrencyItem
            item={item}
            isActive={fromCurrency.code === item.code}
            onPress={setFromCurrency}
        />
    );

    const renderCurrencyItemTo = ({ item }: any) => (
        <CurrencyItem
            item={item}
            isActive={toCurrency.code === item.code}
            onPress={setToCurrency}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={Colors.accent} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Currency Conversion</Text>
                    <TouchableOpacity onPress={refreshRates} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={20} color={Colors.accent} />
                    </TouchableOpacity>
                </View>

                {error && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="warning" size={16} color="#FF9500" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.converterContent}>
                    {/* FROM CARD */}
                    <View style={styles.card}>
                        <Text style={styles.label}>From</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={inputValue}
                                onChangeText={setInputValue}
                                keyboardType="numeric"
                            />
                            <View style={styles.currencySelector}>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={14} color={Colors.textSecondary} style={styles.searchIcon} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={searchFrom}
                                        onChangeText={setSearchFrom}
                                    />
                                </View>
                                <FlatList
                                    data={filteredFromList}
                                    renderItem={renderCurrencyItemFrom}
                                    keyExtractor={item => item.code}
                                    style={styles.currencyList}
                                    nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="handled"
                                    initialNumToRender={10}
                                    windowSize={5}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={swapCurrencies} style={styles.swapBtn}>
                        <Ionicons name="swap-vertical" size={24} color={Colors.accent} />
                    </TouchableOpacity>

                    {/* TO CARD */}
                    <View style={styles.card}>
                        <Text style={styles.label}>To</Text>
                        <View style={styles.inputRow}>
                            <Text style={styles.resultValue}>{outputValue || '0.00'}</Text>
                            <View style={styles.currencySelector}>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={14} color={Colors.textSecondary} style={styles.searchIcon} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={searchTo}
                                        onChangeText={setSearchTo}
                                    />
                                </View>
                                <FlatList
                                    data={filteredToList}
                                    renderItem={renderCurrencyItemTo}
                                    keyExtractor={item => item.code}
                                    style={styles.currencyList}
                                    nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="handled"
                                    initialNumToRender={10}
                                    windowSize={5}
                                />
                            </View>
                        </View>
                    </View>

                    {fromCurrency && (
                        <View style={styles.infoBox}>
                            <Ionicons name="globe-outline" size={16} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>
                                {fromCurrency.flag} {fromCurrency.name} ➡️ {toCurrency.flag} {toCurrency.name}
                            </Text>
                        </View>
                    )}

                    {lastUpdate && (
                        <View style={styles.infoBox}>
                            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>Last updated: {lastUpdate}</Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
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
    refreshButton: {
        marginLeft: 'auto',
        padding: 5,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 15,
        fontSize: 14,
    },
    errorBanner: {
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#FF9500',
        padding: 12,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF9500',
        fontSize: 12,
        marginLeft: 8,
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    converterContent: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 15,
        height: 220,
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
    currencySelector: {
        width: 140,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        marginLeft: 10,
        paddingLeft: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
        height: 36,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 13,
        padding: 0,
    },
    currencyList: {
        flex: 1,
    },
    currencyItem: {
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    activeCurrencyItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    currencyFlag: {
        fontSize: 16,
        marginRight: 5,
    },
    currencyItemText: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    activeCurrencyItemText: {
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
        marginTop: 10,
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
