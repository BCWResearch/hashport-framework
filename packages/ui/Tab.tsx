import { Tab as MuiTab, TabProps as MuiTabProps } from "@mui/material";
import {
    SxProps,
    Theme,
    styled,
} from '@mui/material/styles';
import React from "react";
import { rgba } from "polished";

const StyledTab = styled(MuiTab)(({ theme }) => ({
    lineHeight: 2,
    minHeight: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    textTransform: `none`,
    color: rgba('white', 0.4),
    fontWeight: 400,
    fontSize: theme.typography.body1.fontSize,
    padding: theme.spacing(0, 1, 0, 1),
    transition: `transform 1s ease, fontSize 1s ease, opacity 1s ease, color 1s ease, background-color 1.5s ease`,
    "&.Mui-selected": {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
    },
    // [ theme.breakpoints.up(`sm`) ]: {
    //     ...((value === RoutePaths.SETTINGS) && {
    //         "&.MuiTab-root": {
    //             opacity: 0,
    //             position: `absolute`,
    //             top: `-500%`,
    //             pointerEvents: `none`,
    //         },
    //     }),
    // },
    [ theme.breakpoints.down(`sm`) ]: {
        "&:not(.Mui-selected)": {
            opacity: 0,
            position: `absolute`,
            top: `-500%`,
            pointerEvents: `none`,
        },
    },
}));
export const Tab = ({ ...rest }: MuiTabProps) => {
    return <StyledTab {...rest} />
}

