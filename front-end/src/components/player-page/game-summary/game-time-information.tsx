import {Box, Typography} from "@mui/material";
import React from "react";
import {riotTimestampToGameTime} from "../../../../../Common/utils";

interface GameTimeInformationProps {
    playerWin: boolean;
    gameDuration: number
}

function GameTimeInformation(gameTimeInformationProps: GameTimeInformationProps) {
    return <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Box sx={{width: "40px"}}>
            <Typography align="center">
                {gameTimeInformationProps.playerWin ? "Win" : "Loss"}
            </Typography>
            <hr></hr>
            <Typography align="center" variant="body2">
                {riotTimestampToGameTime(gameTimeInformationProps.gameDuration)}
            </Typography>
        </Box>
    </Box>;
}

export default GameTimeInformation;