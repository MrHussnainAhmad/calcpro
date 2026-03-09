import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calculator from './components/Calculator';
import FormulaScreen from './screens/FormulaScreen';
import CalculusScreen from './screens/CalculusScreen';
import MatrixScreen from './screens/MatrixScreen';
import GraphScreen from './screens/GraphScreen';
import AdvancedMenuScreen from './screens/AdvancedMenuScreen';
import AdvancedMathScreen from './screens/AdvancedMathScreen';
import ConstantsScreen from './screens/ConstantsScreen';
import UnitConverterScreen from './screens/UnitConverterScreen';
import ScratchpadScreen from './screens/ScratchpadScreen';
import FinanceScreen from './screens/FinanceScreen';
import AddFormulaScreen from './screens/AddFormulaScreen';
import ThemeScreen from './screens/ThemeScreen';
import ConversionsMenuScreen from './screens/ConversionsMenuScreen';
import TimeConversionScreen from './screens/TimeConversionScreen';
import CurrencyConversionScreen from './screens/CurrencyConversionScreen';
import DataConversionScreen from './screens/DataConversionScreen';
import { ThemeProvider } from './context/ThemeContext';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import UpdateAlert from './components/UpdateAlert';

import { useTheme } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();
  const appState = useRef(AppState.currentState);

  // State for Custom Alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<'soft' | 'hard' | 'ota' | null>(null);
  const [playStoreUrl, setPlayStoreUrl] = useState('');

  const checkVersionAndUpdates = async () => {
    // 1. Check for OTA Updates first
    if (!__DEV__) {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setAlertType('ota');
          setAlertVisible(true);
          return; // Stop here if OTA update is being applied
        }
      } catch (error) {
        // console.warn(`Error fetching latest Expo update: ${error}`);
      }
    }

    // 2. Check for Store Version (Play Store)
    try {
      const response = await fetch('https://app-backend-pgf9.vercel.app/p/config/exchange-rates');
      const data = await response.json();
      const appVersionFromServer = data.version;
      const currentVersion = Constants.expoConfig?.version || '1.0.0';

      if (appVersionFromServer && currentVersion) {
        const parseVersion = (v: string) => v.split('.').map(Number);
        const [s1, s2, s3] = parseVersion(appVersionFromServer);
        const [c1, c2, c3] = parseVersion(currentVersion);

        const serverVal = s1 * 1000000 + s2 * 1000 + s3;
        const currentVal = c1 * 1000000 + c2 * 1000 + c3;

        if (serverVal > currentVal) {
          const diff = serverVal - currentVal;
          const url = `https://play.google.com/store/apps/details?id=${Constants.expoConfig?.android?.package || 'com.hussnainahmad.calcpro'}`;
          setPlayStoreUrl(url);

          if (diff <= 1) {
            setAlertType('soft');
            setAlertVisible(true);
          } else {
            setAlertType('hard');
            setAlertVisible(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }
  };

  useEffect(() => {
    checkVersionAndUpdates();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkVersionAndUpdates();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleUpdateAction = () => {
    if (alertType === 'ota') {
      Updates.reloadAsync();
    } else {
      Linking.openURL(playStoreUrl);
    }
  };

  const navTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.accent,
      background: theme.dark,
      card: theme.secondary,
      text: theme.textPrimary,
      border: theme.gray,
      notification: theme.accent,
    },
    fonts: DefaultTheme.fonts
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: theme.dark }
        }}
      >
        <Stack.Screen name="Home" component={Calculator} />
        <Stack.Screen name="Formula" component={FormulaScreen} />
        <Stack.Screen name="Calculus" component={CalculusScreen} />
        <Stack.Screen name="Matrix" component={MatrixScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="AdvancedMenu" component={AdvancedMenuScreen} />
        <Stack.Screen name="AdvancedMath" component={AdvancedMathScreen} />
        <Stack.Screen name="Constants" component={ConstantsScreen} />
        <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
        <Stack.Screen name="ConversionsMenu" component={ConversionsMenuScreen} />
        <Stack.Screen name="TimeConversion" component={TimeConversionScreen} />
        <Stack.Screen name="CurrencyConversion" component={CurrencyConversionScreen} />
        <Stack.Screen name="DataConversion" component={DataConversionScreen} />
        <Stack.Screen name="Scratchpad" component={ScratchpadScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="AddFormula" component={AddFormulaScreen} />
        <Stack.Screen name="Themes" component={ThemeScreen} />
      </Stack.Navigator>

      {/* Global Custom Alert */}
      <UpdateAlert 
        visible={alertVisible}
        type={alertType}
        onUpdate={handleUpdateAction}
        onCancel={() => setAlertVisible(false)}
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}


