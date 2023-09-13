import { ThemeMode } from "@/features/dashboard/enums/ThemeMode.enum";
import { themeSettings } from "@/themes/theme";
import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

interface DynamicThemeProviderProps {
    children: ReactNode;
    baseTheme: any; // Replace with the exact type of your theme, if known
}

export function DynamicThemeProvider({
    children,
    baseTheme,
}: DynamicThemeProviderProps) {
    const [primaryColor, setPrimaryColor] = useState<string>("#248ad5");
    const themeLocalStorage =
        localStorage.getItem("theme") === ThemeMode.LIGHT
            ? ThemeMode.LIGHT
            : ThemeMode.DARK;

    const theme = useMemo(
        () => createTheme(themeSettings(themeLocalStorage, primaryColor)),
        [primaryColor, baseTheme]
    );

    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}

interface ThemeContextProps {
    primaryColor: string;
    setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error(
            "useThemeContext must be used within a DynamicThemeProvider"
        );
    }
    return context;
}
