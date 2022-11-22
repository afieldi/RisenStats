import {Tooltip, Typography} from "@mui/material";
import React from "react";
import {getNumberWithSuffix} from "../../../common/utils";

interface LeaderboardRankingProps {
    rank: number
    leagueAvg: number
    totalPLayersOnLeaderboard: number
}

const FIRST = "#FFA500";
const SECOND = "#85BCBF";
const THIRD = "#834B24";
const NTH = "#565554"

const rankToColorMap: Record<number, string> = {
    1: FIRST,
    2: SECOND,
    3: THIRD,
}

export default function LeaderboardRanking(leaderboardRankingProps: LeaderboardRankingProps) {
    const ranking: string = getNumberWithSuffix(leaderboardRankingProps.rank);
    const color: string = !!rankToColorMap[leaderboardRankingProps.rank] ? rankToColorMap[leaderboardRankingProps.rank] : NTH;
    return (
        <Typography color={color} variant="body2">
            <Tooltip title={`Average: ${leaderboardRankingProps.leagueAvg.toFixed(2)} (${leaderboardRankingProps.totalPLayersOnLeaderboard} players)`}><p>{ranking}</p></Tooltip>
        </Typography>
    )
}