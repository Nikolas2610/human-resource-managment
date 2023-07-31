import { ThemeMode } from "../features/dashboard/enums/ThemeMode.enum";

interface ThemeSettings {
    palette: {
        mode: "light" | "dark";
        primary?: { main: string; light?: string; dark?: string };
        secondary?: { main: string; light?: string; dark?: string };
        neutral?: { main: string; light?: string; dark?: string };
        background?: { paper: string; default: string };
    };
    typography: {
        fontFamily: string;
        fontSize: number;
        h1: { fontFamily: string; fontSize: number };
        h2: { fontFamily: string; fontSize: number };
        h3: { fontFamily: string; fontSize: number };
        h4: { fontFamily: string; fontSize: number };
        h5: { fontFamily: string; fontSize: number };
        h6: { fontFamily: string; fontSize: number };
    };
}

// mui theme settings
export const themeSettings = (mode: ThemeMode): ThemeSettings => {
    return {
        palette: {
            mode: mode,
            ...(mode === ThemeMode.DARK
                ? {
                      // palette values for dark mode
                      primary: {
                          main: "#5F4BB6",
                      },
                      secondary: {
                          main: "#F6AE2D",
                      },
                      background: {
                          default: "#212221",
                          paper: "#202A25",
                      },
                  }
                : {
                      // palette values for light mode
                      primary: {
                          main: "#5F4BB6",
                      },
                      secondary: {
                          main: "#F1D302",
                      },
                      background: {
                          default: "#D3D5D3",
                          paper: "#1F2220",
                      },
                  }),
        },
        typography: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 14,
            h1: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};
