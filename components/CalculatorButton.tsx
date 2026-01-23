import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;

interface CalculatorButtonProps {
    onPress: (text: string) => void;
    text: string;
    size?: 'double' | 'single';
    theme?: 'secondary' | 'accent' | 'primary';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function CalculatorButton({ onPress, text, size = 'single', theme = 'primary', style, textStyle }: CalculatorButtonProps) {
    const buttonStyles: ViewStyle[] = [styles.button];
    const textStyles: TextStyle[] = [styles.text];

    const handlePress = () => {
        onPress(text);
    };

    if (size === 'double') {
        buttonStyles.push(styles.buttonDouble);
    }

    if (theme === 'secondary') {
        buttonStyles.push(styles.buttonSecondary);
        textStyles.push(styles.textSecondary);
    } else if (theme === 'accent') {
        buttonStyles.push(styles.buttonAccent);
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
                    text === '.' && { fontSize: 40, marginTop: -10 }, // Nudge dot up
                    textStyle
                ]}
                numberOfLines={1}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.gray,
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        margin: 10, // Increased margin for smaller buttons
    },
    buttonDouble: {
        flex: 2,
        aspectRatio: 'auto',
        alignItems: 'flex-start',
        paddingLeft: 30,
    },
    buttonSecondary: {
        backgroundColor: Colors.lightGray,
    },
    buttonAccent: {
        backgroundColor: Colors.accent,
    },
    text: {
        color: Colors.textPrimary,
        fontSize: 30,
        fontWeight: '500',
        includeFontPadding: false, // Critical for Android vertical centering
        backgroundColor: 'transparent', // Ensure no hidden box issues
    },
    textSecondary: {
        color: Colors.textSecondary,
    },
});