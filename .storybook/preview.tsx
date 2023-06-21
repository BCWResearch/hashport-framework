import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { Preview } from '@storybook/react';
import React from 'react';
import { Palette, shape, typography } from '../theme/theme';
import { pink, cyan, blueGrey, red } from '@mui/material/colors';
import { rgba, darken } from "polished"

// const newTheme = createTheme({
//     palette: Palette(colorPalette),
//     shape,
//     typography,
// });

const colorPalette = {
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
};

export const theme = createTheme({
    palette: {
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
    },
});
const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            expanded: true, // Adds the description and default columns
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme}>
                {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
                <Story />
            </ThemeProvider>
        ),
    ],
};

export default preview;
