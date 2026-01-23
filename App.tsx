import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
import { Colors } from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.dark } }}>
        <Stack.Screen name="Home" component={Calculator} />
        <Stack.Screen name="Formula" component={FormulaScreen} />
        <Stack.Screen name="Calculus" component={CalculusScreen} />
        <Stack.Screen name="Matrix" component={MatrixScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="AdvancedMenu" component={AdvancedMenuScreen} />
        <Stack.Screen name="AdvancedMath" component={AdvancedMathScreen} />
        <Stack.Screen name="Constants" component={ConstantsScreen} />
        <Stack.Screen name="UnitConverter" component={UnitConverterScreen} />
        <Stack.Screen name="Scratchpad" component={ScratchpadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'center',
  },
});
