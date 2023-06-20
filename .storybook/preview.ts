import type { Preview } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import { blueGrey, cyan, pink } from '@mui/material/colors';
import { Story } from '@storybook/react';
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: cyan['A200'],
        },
        secondary: {
            main: pink['A400'],
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: pink['A200'],
        },
        secondary: {
            main: cyan['A400'],
        },
        background: {
            default: blueGrey['800'],
            paper: blueGrey['700'],
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
};

export default preview;
