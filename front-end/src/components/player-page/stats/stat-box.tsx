import {useTheme} from "@emotion/react";
import {Box, Grid, Theme, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import {PlayerStat} from "../stats";

interface StatBoxProps extends PlayerStat {
}

export default function StatBox(statBoxProps: StatBoxProps)
{
    const theme = useTheme() as Theme;
    return (
        <RisenBox1 sx={{minWidth: 200}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Grid container>
                   <Grid item xs>
                       <Typography color={theme.palette.primary.main} variant="h3">
                           {statBoxProps.statValue}
                       </Typography>
                   </Grid>
                    <Grid item xs>
                        <Typography sx={{fontStyle: 'italic'}} color={'#837d7d'} variant="subtitle2">
                            (1st)
                        </Typography>
                    </Grid>
                </Grid>

                <Typography color={theme.palette.info.light} variant="h6">
                    {statBoxProps.statTitle}
                </Typography>
            </Box>
        </RisenBox1>
    )
}