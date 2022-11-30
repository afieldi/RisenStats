import {useTheme} from "@emotion/react";
import {Box, Divider, Theme, Typography} from "@mui/material";
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
        <RisenBox1>
            <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="h5" >CHAMPIONS</Typography>
            <Divider sx={{marginBottom: 2}}/>
            <Box sx={{display: "flex", columnGap: 1, rowGap: 1, flexWrap: "wrap"}}>
                { championOverviewProps.championData.map((champData, index) =>
                    <ChampionSummaryBox key={index} championData={champData}/>
                )}
            </Box>
        </RisenBox1>
    );
}
