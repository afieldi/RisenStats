import {useTheme} from "@emotion/react";
import {Box, Grid, Grow, Theme, Tooltip, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";

interface StatBoxProps {
    statTitle: String
    statValue: String
    statToolTip: String
    haveStatsLoaded: boolean
}

export default function StatBox(statBoxProps: StatBoxProps) {
    const theme = useTheme() as Theme;
    return (
        <RisenBox1 sx={{minWidth: 110, maxWidth: 110, minHeight: 110, maxHeight: 110}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {!statBoxProps.haveStatsLoaded &&
                    <Typography color={theme.palette.info.light} variant="subtitle2">
                        <Tooltip title={"No data available, maybe press the update button?"}><div>No Data</div></Tooltip>
                    </Typography>
                }
                <Grow in={statBoxProps.haveStatsLoaded} style={{ transitionDelay: '200ms'}}>
                    <div>
                        <Typography color={theme.palette.primary.main} variant="h5">
                            {statBoxProps.statValue}
                        </Typography>
                        <Typography color={theme.palette.info.light} variant="subtitle2">
                            <Tooltip title={statBoxProps.statToolTip}><div>{statBoxProps.statTitle}</div></Tooltip>
                        </Typography>
                    </div>
                </Grow>
            </Box>
        </RisenBox1>
    )
}