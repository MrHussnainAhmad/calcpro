import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

interface CalculatorButtonProps {
    onPress: (text: string) => void;
    text: string;
    size?: 'double' | 'single';
    theme?: 'secondary' | 'accent' | 'primary';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CalculatorButton = React.memo(({ onPress, text, size = 'single', theme: themeProp = 'primary', style, textStyle }: CalculatorButtonProps) => {
    const { theme } = useTheme();
    const buttonStyles: ViewStyle[] = [styles.button, { backgroundColor: theme.gray }];
    const textStyles: TextStyle[] = [styles.text, { color: theme.textPrimary }];

    const handlePress = () => {
        onPress(text);
    };

    if (size === 'double') {
        buttonStyles.push(styles.buttonDouble);
    }

    if (themeProp === 'secondary') {
        buttonStyles.push({ backgroundColor: theme.lightGray });
        textStyles.push({ color: theme.black });
    } else if (themeProp === 'accent') {
        buttonStyles.push({ backgroundColor: theme.accent });
    }

    if (style) {
        buttonStyles.push(style);
    }

    return (
        <TouchableOpacity onPress={handlePress} style={buttonStyles}>
            <Text
                style={[
                    textStyles,
                    text.length > 2 && { fontSize: 18 },
                    text === '.' && { fontSize: 40, marginTop: -10 },
                    textStyle
                ]}
                numberOfLines={1}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
});

export default CalculatorButton;

const styles = StyleSheet.create({
    button: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        margin: 10,
    },
    buttonDouble: {
        flex: 2,
        aspectRatio: 'auto',
        alignItems: 'flex-start',
        paddingLeft: 30,
    },
    text: {
        fontSize: 30,
        fontWeight: '500',
        includeFontPadding: false,
        backgroundColor: 'transparent',
    },
});