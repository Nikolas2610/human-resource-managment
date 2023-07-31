import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ThemeMode } from "./enums/ThemeMode.enum";
import { RootState } from "../../app/store";

const themeStorage: string | null = localStorage.getItem("theme");

export interface DashboardState {
    themeMode: ThemeMode;
    drawerOpen: boolean;
    isLoading: boolean;
    drawerWidth: number;
    title: string;
}

const initialState: DashboardState = {
    themeMode:
        themeStorage === ThemeMode.LIGHT ? ThemeMode.LIGHT : ThemeMode.DARK,
    drawerOpen: true,
    isLoading: true,
    drawerWidth: 240,
    title: "Dashboard",
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        toggleThemeMode: (state) => {
            const theme =
                state.themeMode === ThemeMode.LIGHT
                    ? ThemeMode.DARK
                    : ThemeMode.LIGHT;
            state.themeMode = theme;
            localStorage.setItem("theme", theme);
        },
        toggleDrawerOpen: (state) => {
            state.drawerOpen = !state.drawerOpen;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        toggleDrawer: (state, action: PayloadAction<boolean>) => {
            state.drawerOpen = action.payload;
        },
        setPageTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
    },
});

export const selectDrawerWidth = (state: RootState) =>
    state.dashboard.drawerWidth;

export const {
    toggleThemeMode,
    toggleDrawerOpen,
    setLoading,
    toggleDrawer,
    setPageTitle,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
