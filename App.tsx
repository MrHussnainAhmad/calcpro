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
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { useTheme } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new version of the app is available. The app will now restart to apply the update.',
            [{ text: 'OK', onPress: () => Updates.reloadAsync() }]
          );
        }
      } catch (error) {
        // You can also add an error handler here
        console.warn(`Error fetching latest Expo update: ${error}`);
      }
    }

    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

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

