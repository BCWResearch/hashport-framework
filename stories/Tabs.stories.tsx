import type { Meta, StoryObj } from '@storybook/react';
// import { Tabs, useTheme } from '@mui/material';
import { Tabs } from "../packages/ui/Tabs"
import React, { useState } from 'react';
import ArrowDropDownCircleRoundedIcon from '@mui/icons-material/ArrowDropDownCircleRounded';
import { Tab } from '../packages/ui/Tab';
// Use this template file to build stories for editing hashport components
// const theme = useTheme();
const meta = {
    title: 'Hashport UI/Component/Tabs',
    component: Tabs,
    tags: [ 'autodocs' ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;


const DefaultGroupTabs = (icons?) => {
    const [ value, setValue ] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (<Tabs
        value={value}
        onChange={handleChange}
    >
        {[ `Tab 1`, `Tab 2`, `Tab 3`, `Tab 4`, `Tab 5`, `Tab 6`, `Tab 7`, `Tab 8` ].map((title, i) => {
            return (<Tab value={i} label={title} icon={icons} iconPosition={icons && "start"} />)
        })}
    </Tabs>)
}




export const DefaultTabs: Story = {
    render: (args) => (DefaultGroupTabs())
}

export const IconTabs: Story = {
    render: (args) => (DefaultGroupTabs(<ArrowDropDownCircleRoundedIcon />))
}




