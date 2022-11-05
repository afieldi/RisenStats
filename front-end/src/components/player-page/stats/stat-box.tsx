import {useTheme} from "@emotion/react";
import {Box, Grid, Grow, Theme, Tooltip, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import {PlayerStat} from "../stats";

interface StatBoxProps extends PlayerStat {
}

export default function StatBox(statBoxProps: StatBoxProps) {
    const theme = useTheme() as Theme;
    const haveStatsLoaded = true; // TODO update this when backend is done
    const toolTip = "This is a tooltip that explains the stat"; // TODO use a map to grab tooltips
    return (
        <RisenBox1 sx={{minWidth: 110, maxWidth: 110, minHeight: 110, maxHeight: 110}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Grow in={haveStatsLoaded} style={{ transitionDelay: '200ms'}}>
                    <div>
                        <Typography color={theme.palette.primary.main} variant="h5">
                            {statBoxProps.statValue}
                        </Typography>
                        <Typography color={theme.palette.info.light} variant="subtitle2">
                            <Tooltip title={toolTip}><div>{statBoxProps.statTitle}</div></Tooltip>
                        </Typography>
                    </div>
                </Grow>
            </Box>
        </RisenBox1>
    )
}