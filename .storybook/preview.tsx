import type { Preview } from '@storybook/react';
import { createTheme } from '@mui/material';
import { blueGrey, cyan, pink } from '@mui/material/colors';
import { Story } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from '../theme';
import React from 'react';

/* snipped for brevity */

export const withMuiTheme = Story => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Story />
    </ThemeProvider>
);

export const decorators = [ withMuiTheme ];
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
