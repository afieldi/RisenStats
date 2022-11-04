import {useTheme} from "@emotion/react";
import {Box, Grid, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../../Common/models/playerchampionstats.model";
import RisenBox1 from "../../risen-box/risen-box-1";
import ChampionSummaryBox from "./champion-summary-box";


interface ChampionOverviewProps {
    championData: PlayerChampionStatsModel[]
}

export default function ChampionOverview(championOverviewProps: ChampionOverviewProps) {
    const theme = useTheme() as Theme;

    return (
        <Grid item xs={1} md={1}>
            <Typography color={theme.palette.info.light} align="left" variant="h4">Champions</Typography>
            <RisenBox1 sx={{display: "flex", columnGap: 1, rowGap: 1, flexWrap: "wrap"}}>
                { championOverviewProps.championData.map((champData) =>
                    <ChampionSummaryBox championData={champData}/>
                )}
            </RisenBox1>
        </Grid>
    );
}
