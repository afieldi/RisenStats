import {useTheme} from "@emotion/react";
import {Box, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../../Common/models/playerchampionstats.model";

interface ChampionSummaryBoxProps {
    championData: PlayerChampionStatsModel
}


export default function ChampionSummaryBox(championOverviewProps: ChampionSummaryBoxProps) {
    const theme = useTheme() as Theme;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <img src={`/images/champions/icons/${championOverviewProps.championData.championId}_0.png`} height="50px" width="50px"></img>
            <Typography color={theme.palette.info.light} variant="subtitle2">
                {championOverviewProps.championData.totalGames}
            </Typography>
        </Box>
    );
}
