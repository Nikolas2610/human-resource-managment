import { ThemeMode } from "../features/dashboard/enums/ThemeMode.enum";

interface ThemeSettings {
    palette: {
        mode: "light" | "dark";
        primary?: {
            main: string;
            light?: string;
            dark?: string;
            contrastText?: string;
        };
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
export const themeSettings = (
    mode: ThemeMode,
    primaryColor: string = "#248ad5",
    secondaryColor: string = "#7c80e3"
): ThemeSettings => {
    return {
        palette: {
            mode: mode,
            ...(mode === ThemeMode.DARK
                ? {
                      // palette values for dark mode
                      primary: {
                          main: primaryColor,
                          //   contrastText: "#859ab0",
                      },
                      secondary: {
                          main: secondaryColor,
                      },
                      background: {
                          default: "#171c24",
                          paper: "#222b36",
                      },
                  }
                : {
                      // palette values for light mode
                      primary: {
                        //   main: "#5F4BB6",
                          main: primaryColor,
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
