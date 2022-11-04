import {useTheme} from "@emotion/react";
import {Box, Grid, Theme, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import {PlayerStat} from "../stats";

interface StatBoxProps extends PlayerStat {
}

export default function StatBox(statBoxProps: StatBoxProps) {
    const theme = useTheme() as Theme;
    return (
        <RisenBox1 sx={{minWidth: 110, maxWidth: 110, minHeight: 110, maxHeight: 110}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography color={theme.palette.primary.main} variant="h6">
                    {statBoxProps.statValue}
                </Typography>
                <Typography color={theme.palette.info.light} variant="subtitle2">
                    {statBoxProps.statTitle}
                </Typography>
            </Box>
        </RisenBox1>
    )
}