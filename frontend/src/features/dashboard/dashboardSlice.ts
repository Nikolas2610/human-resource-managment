import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ThemeMode } from "./enums/ThemeMode.enum";
import { RootState } from "../../app/store";

const themeStorage: string | null = localStorage.getItem("theme");

export interface DashboardState {
    themeMode: ThemeMode;
    drawerOpen: boolean;
    isLoading: boolean;
    isAppLoading: boolean;
    drawerWidth: number;
    title: string;
}

const initialState: DashboardState = {
    themeMode:
        themeStorage === ThemeMode.LIGHT ? ThemeMode.LIGHT : ThemeMode.DARK,
    drawerOpen: true,
    isLoading: false,
    isAppLoading: true,
    drawerWidth: 300,
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
        toggleDashboardLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        toggleAppLoading: (state, action: PayloadAction<boolean>) => {
            state.isAppLoading = action.payload;
        },
        toggleDrawer: (state, action: PayloadAction<boolean>) => {
            localStorage.setItem("openDrawer", action.payload ? "open" : "close");
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
    toggleDashboardLoading,
    toggleDrawer,
    setPageTitle,
    toggleAppLoading
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
