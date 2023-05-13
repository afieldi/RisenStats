import {useTheme} from "@emotion/react";
import {Box, Divider, SxProps, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import BaseRisenBox from "../risen-box/base-risen-box";
import ChampionSummaryBox from "./champion-summary-box";


interface ChampionOverviewProps {
    championData: PlayerChampionStatsModel[]
    sx?: SxProps<Theme>;
}

export default function ChampionOverview(championOverviewProps: ChampionOverviewProps) {
    const theme = useTheme() as Theme;

    return (
        <BaseRisenBox title="CHAMPIONS" sx={championOverviewProps.sx}>
            <Box sx={{display: "flex", columnGap: 1, rowGap: 1, flexWrap: "wrap"}}>
                { championOverviewProps.championData.map((champData, index) =>
                    <ChampionSummaryBox key={index} championData={champData}/>
                )}
            </Box>
        </BaseRisenBox>
    );
}
