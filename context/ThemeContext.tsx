import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, AppTheme } from '../constants/Colors';

interface ThemeContextType {
    theme: typeof Themes.OLED;
    themeName: AppTheme;
    setTheme: (name: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: Themes.OLED,
    themeName: 'OLED',
    setTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<AppTheme>('OLED');

    useEffect(() => {
        const loadTheme = async () => {
            const saved = await AsyncStorage.getItem('app_theme');
            if (saved && (Themes as any)[saved]) {
                setThemeName(saved as AppTheme);
            }
        };
        loadTheme();
    }, []);

    const changeTheme = async (name: AppTheme) => {
        setThemeName(name);
        await AsyncStorage.setItem('app_theme', name);
    };

    return (
        <ThemeContext.Provider value={{
            theme: (Themes as any)[themeName],
            themeName,
            setTheme: changeTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
