import {Box, Typography} from "@mui/material";
import React from "react";
import {riotTimestampToGameTime, timeToTimeAgo} from "../../../../../Common/utils";

interface GameTimeInformationProps {
    playerWin: boolean;
    gameDuration: number;
    gameStart: number;
}

function GameTimeInformation(gameTimeInformationProps: GameTimeInformationProps) {
    const {
        playerWin,
        gameDuration,
        gameStart,
    } = gameTimeInformationProps;
    return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: '5px'}}>
        <Box sx={{width: "80px"}}>
            <Typography align="center">
                {playerWin ? "Win" : "Loss"}
            </Typography>
            <hr></hr>
            <Typography align="center" variant="body2">
                {riotTimestampToGameTime(gameDuration)}
            </Typography>
            <Typography align="center" variant="subtitle2">
                {timeToTimeAgo(+gameStart + +gameDuration)}
            </Typography>
        </Box>
    </Box>);
}

export default GameTimeInformation;