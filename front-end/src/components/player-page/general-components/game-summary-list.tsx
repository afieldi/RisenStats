import React from "react";
import {Box, Container} from "@mui/material";
import GameSummary from "./game-summary";
import {PlayerDetailedGame} from "../../../../../Common/Interface/Internal/player";
import LoadingButton from "../../loading-button/LoadingButton";

interface Props {
    gameList: PlayerDetailedGame[];
    loadGamesConfig: {
        callback: (newPlayer: boolean) => void,
        status: boolean
    };
}

function GameSummaryList({gameList, loadGamesConfig}: Props) {
    if (!gameList) {
        gameList = [];
    }
    return (
        <Container sx={{pr: 0, pl: 0}}>
            {gameList.map((game, i) => {
                return (
                    <GameSummary key={`game-${i}`} gameData={game}/>
                );
            })}
            <Box>
                <LoadingButton color="primary" onClick={() => {
                    loadGamesConfig.callback(false)
                }} loading={loadGamesConfig.status}>Load More</LoadingButton>
            </Box>
        </Container>
    );
}

export default GameSummaryList;