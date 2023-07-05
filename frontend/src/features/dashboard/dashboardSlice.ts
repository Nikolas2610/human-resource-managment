import { createSlice } from '@reduxjs/toolkit';

const themeStorage: string | null = localStorage.getItem("theme");

export interface DashboardState {
  themeMode: 'light' | 'dark';
  drawerOpen: boolean;
}

const initialState: DashboardState = {
  themeMode: themeStorage === 'light' ? 'light' : 'dark',
  drawerOpen: true,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      const theme = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = theme;
      localStorage.setItem("theme", theme)
    },
    toggleDrawerOpen: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
  },
});

export const { toggleThemeMode, toggleDrawerOpen } = dashboardSlice.actions;
export default dashboardSlice.reducer;