import {
    createTheme,
    PaletteOptions,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
import { rgba, darken } from "polished";
import { red } from '@mui/material/colors';


export function Typography() {
    const localeFontFamily = `Inter`;
    const localeWeightLight = 300;
    const localeWeightMedium = 400;
    const localeWeightRegular = 400;
    const localeWeightBold = 700;

    const fonts = [
        localeFontFamily,
        `-apple-system`,
        `Segoe UI`,
        `Helvetica`,
        `sans-serif`,
    ];

    const fontFamily = fonts.map(font => `"${font}"`).join(`,`);

    return {
        fontFamily: fontFamily,
        fontWeightBold: localeWeightLight,
        fontWeightLight: localeWeightMedium,
        fontWeightMedium: localeWeightRegular,
        fontWeightRegular: localeWeightBold,
    };
}


export const shape = {
    borderRadius: 12,
};

export const typography = Typography();

export const colorPalette = {

    text: {
        light: `#222`,
        dark: `#f7f8fa`,
    },
    primary: `rgba(45,132,235,1)`,
    secondary: `rgba(45,132,235,1)`,
    gradientPrimary: `#b0e3ff`,
    gradientSecondary: `#fdf2ec`,
    error: {
        contrastText: `#FFF`,
        main: red[ 500 ],
    },
    info: {
        contrastText: `#FFF`,
        main: `#2D84EB`,
    },
    success: {
        contrastText: `#FFF`,
        main: `#07E78E`,
    },
    warning: {
        contrastText: `#FFF`,
        light: `#ed6c02`,
        dark: `#661a00`,
        main: `#FF4200`,
    },

}

export function Palette(colorPalette): PaletteOptions {

    return {
        mode: `dark`,
        background: {
            default: `transparent`,
        },
        text: {
            primary: colorPalette.text.dark,
        },
        primary: {
            contrastText: colorPalette.text.light,
            main: colorPalette.primary,
            light: rgba(colorPalette.primary, 0.1),
            dark: darken(0.1, colorPalette.primary),
        },
        secondary: {
            contrastText: colorPalette.text.light,
            main: colorPalette.secondary,
            light: rgba(colorPalette.secondary, 0.1),
            dark: rgba(colorPalette.secondary, 0.5),
        },
        error: {
            contrastText: colorPalette.error.contrastText,
            main: colorPalette.error.main,
        },
        info: {
            contrastText: colorPalette.info.contrastText,
            main: colorPalette.info.main,
        },
        success: {
            contrastText: colorPalette.success.contrastText,
            main: colorPalette.success.main,
        },
        warning: {
            contrastText: colorPalette.warning.contrastText,
            light: colorPalette.warning.light,
            dark: colorPalette.warning.dark,
            main: colorPalette.warning.main,
        },
    };
}




