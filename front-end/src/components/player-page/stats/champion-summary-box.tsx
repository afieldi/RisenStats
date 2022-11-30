import {useTheme} from "@emotion/react";
import {Box, Grow, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../../Common/models/playerchampionstats.model";

interface ChampionSummaryBoxProps {
    championData: PlayerChampionStatsModel
}


export default function ChampionSummaryBox(championOverviewProps: ChampionSummaryBoxProps) {
    const theme = useTheme() as Theme;
    return (
        <Grow in={true} style={{ transitionDelay: '150ms'}}>
            <Box sx={{ height:55, width: 55}} >
                <img alt={`${championOverviewProps.championData.championId}`}
                     src={`/images/champions/icons/${championOverviewProps.championData.championId}_0.png`}
                     height="50px"
                     width="50px"/>
                <Box sx= {{  position: "relative",
                    bgcolor: theme.palette.risenBoxBg.main,
                    bottom: 26,
                    right: -35,
                    width: 20,
                    height: 20 }}>
                    <Typography color={theme.palette.info.light} variant="button">
                        {championOverviewProps.championData.totalGames}
                    </Typography>
                </Box>
            </Box>
        </Grow>
    );
}
