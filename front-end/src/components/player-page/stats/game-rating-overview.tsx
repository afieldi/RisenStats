import {Box, Fade, Grow, Slide} from "@mui/material";
import React from "react";
import GameRating from "./game-rating";
import { EARLY_GAME_RATING_BY_ROLE, LATE_GAME_RATING_BY_ROLE, OVERALL_GAME_RATING_OVERVIEW } from "../../../common/constants";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {GameRoles} from "../../../../../Common/Interface/General/gameEnums";
import {doesPlayerStatsObjectHaveData} from "../../../../../Common/utils";


interface GameRatingOverviewProps {
    playerStats: PlayerStatModel[]
    roleId: GameRoles,
}

export default function GameRatingOverview(props: GameRatingOverviewProps) {
    return (
        <Fade in={true} style={{ transitionDelay: '600ms'}}>
            <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
                {
                    [EARLY_GAME_RATING_BY_ROLE, LATE_GAME_RATING_BY_ROLE, OVERALL_GAME_RATING_OVERVIEW].map(gameRatingMap => {
                        return <GameRating
                            hasData={doesPlayerStatsObjectHaveData(props.playerStats)}
                            title={gameRatingMap[props.roleId].getStatTitle()}
                            tooltip={gameRatingMap[props.roleId].getToolTip()}
                            rating={gameRatingMap[props.roleId].getStatString(props.playerStats)}
                            rank={gameRatingMap[props.roleId].getRating(props.playerStats)}/>
                    })
                }
            </Box>
        </Fade>
    );
}