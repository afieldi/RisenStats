import {Theme, Tooltip, Typography} from "@mui/material";
import React from "react";
import {getNumberWithSuffix} from "../../../common/utils";
import {useTheme} from "@emotion/react";

interface LeaderboardRankingProps {
    rank: number
    leagueAvg: number
    totalPLayersOnLeaderboard: number
}

export default function LeaderboardRanking(leaderboardRankingProps: LeaderboardRankingProps) {

    const theme = useTheme() as Theme;

    const rankToColorMap: Record<number, string> = {
        1: theme.palette.first.main,
        2: theme.palette.second.main,
        3: theme.palette.third.main,
    }

    const ranking: string = getNumberWithSuffix(leaderboardRankingProps.rank);
    const color: string = !!rankToColorMap[leaderboardRankingProps.rank] ? rankToColorMap[leaderboardRankingProps.rank] : theme.palette.nth.main;
    return (
        <Tooltip title={`Average: ${leaderboardRankingProps.leagueAvg.toFixed(2)} (${leaderboardRankingProps.totalPLayersOnLeaderboard} players)`}>
            <Typography color={color} variant="body2">{ranking}</Typography>
        </Tooltip>
    )
}