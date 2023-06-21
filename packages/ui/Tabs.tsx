import { Tabs as MuiTabs, TabsProps as MuiTabsProps } from "@mui/material";
import {
    SxProps,
    Theme,
    styled,
} from '@mui/material/styles';
import React from "react";

const StyledTabs = styled(MuiTabs)(() => ({
    "& .MuiTabs-flexContainer": {
        transition: `transform 1s ease`,
    },
    "& .MuiTabs-indicator": {
        display: `none`,
    },
    "& .MuiTabScrollButton-root": {
        color: `white`,
    },
    "& .MuiTabs-scroller.MuiTabs-hideScrollbar.MuiTabs-scrollableX": {
        display: `flex`,
        alignItems: `center`,
    },
}));
export const Tabs = ({ ...rest }: MuiTabsProps) => {
    return <StyledTabs {...rest} />
}
