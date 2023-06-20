import { Tab as MuiTab } from "@mui/material";
import {
    SxProps,
    Theme,
    styled,
} from '@mui/material/styles';
import React from "react";
import { rgba } from "polished";

export interface TabProps {
    label: string;
    active?: boolean,
    color?: string,
    disableRipple?: boolean,
    onClick?: () => void,
    sx?: SxProps<Theme>
}

const StyledTab = styled(MuiTab, {
    shouldForwardProp: (prop) => prop !== "active"
})<{ active: boolean, color: string }>(({ theme, active, color }) => ({
    lineHeight: 2,
    textTransform: `none`,
    color: active ? color : rgba('white', 0.4),
    backgroundColor: active ? rgba(color, 0.2) : '',
    borderRadius: theme.spacing(1),
    fontWeight: 400,
    fontSize: theme.typography.h5.fontSize,
    padding: theme.spacing(0, 3, 0, 3),
    transition: `transform 1s ease, fontSize 1s ease, opacity 1s ease, color 1s ease`,
    transform: `scale(0.7)`,
    [ `&:hover` ]: {
        opacity: 0.8,
    }
}));
export const Tab = ({ label, active = false, color = '#5c9fef', disableRipple = false, ...rest }: TabProps) => {
    return <StyledTab label={label} active={active} color={color} disableRipple={disableRipple} {...rest} />
}

