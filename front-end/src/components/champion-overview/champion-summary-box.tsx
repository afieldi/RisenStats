import {useTheme} from "@emotion/react";
import {Box, Grow, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import ImgBox from "../risen-box/img-box";

interface ChampionSummaryBoxProps {
    championData: PlayerChampionStatsModel
}


export default function ChampionSummaryBox(championOverviewProps: ChampionSummaryBoxProps) {
    const theme = useTheme() as Theme;
    return (
        // <Grow in={true} style={{ transitionDelay: '150ms'}}>
            <ImgBox
                sx={{ height:55, width: 55}}
                alt={`${championOverviewProps.championData.championId}`}
                src={`/images/champions/icons/${championOverviewProps.championData.championId}_0.png`}
                height="50px"
                width="50px"
                text={championOverviewProps.championData.totalGames.toString()}
            />
        // </Grow>
    );
}
