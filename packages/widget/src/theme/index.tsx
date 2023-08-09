import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
    responsiveFontSizes,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        border: Palette['primary'];
    }
    interface PaletteOptions {
        border?: PaletteOptions['primary'];
    }
    interface PaletteColor {
        darker: string;
    }

    interface SimplePaletteColorOptions {
        darker?: string;
    }
}

let theme = createTheme({
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    transition: `font-size 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backdropFilter: `blur(5px) brightness(50%)`,
                },
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
        },
    },
    palette: {
        primary: {
            main: 'rgb(45,132,235)',
            light: 'hsl(213deg 95% 69%)',
            dark: 'hsl(213deg 50% 25% / 0.75)',
            darker: 'hsl(213deg 98% 7% / 0.75)',
        },
        border: {
            main: 'hsl(213deg 82% 55% / 0.25)',
            light: 'hsl(213deg 87% 65% / 0.6)',
            dark: 'rgba(46, 132, 234, 0.25)',
        },
        mode: 'dark',
        contrastThreshold: 4.5,
    },
    shape: {
        borderRadius: 16,
    },
});

theme = responsiveFontSizes(theme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
