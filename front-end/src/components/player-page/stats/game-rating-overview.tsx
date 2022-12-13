import {Box, Fade, Grow, Slide} from "@mui/material";
import React from "react";
import GameRating from "./game-rating";
import {StatGenerators} from "../../../common/utils";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {GameRoles} from "../../../../../Common/Interface/General/gameEnums";
import {BaseStatGenerator} from "../../../common/stats-generators/BaseStatsGenerator";

export enum Rank {
    SPLUS = "S+",
    S = "S",
    A = "A",
    B = "B",
    C = "C",
    D = "D"
}

interface GameRatingOverviewProps {
    playerStats: PlayerStatModel[]
    roleId: GameRoles,
}

const EARLY_GAME_RATING_BY_ROLE: Record<GameRoles, BaseStatGenerator> = {
    ALL:StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
    MIDDLE: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
    TOP: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
    BOTTOM: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
    SUPPORT: StatGenerators.EARLY_GAME_RATING_SUPPORT,
    JUNGLE: StatGenerators.EARLY_GAME_RATING_JUNGLER
}

const LATE_GAME_RATING_BY_ROLE: Record<GameRoles, BaseStatGenerator> = {
    ALL:StatGenerators.LATE_GAME_RATING_SOLO_LANE,
    MIDDLE: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
    TOP: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
    BOTTOM: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
    SUPPORT: StatGenerators.LATE_GAME_RATING_SUPPORT,
    JUNGLE: StatGenerators.LATE_GAME_RATING_JUNGLER
}

const OVERALL_GAME_RATING_OVERVIEW: Record<GameRoles, BaseStatGenerator> = {
    ALL:StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
    MIDDLE: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
    TOP: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
    BOTTOM: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
    SUPPORT: StatGenerators.OVERALL_GAME_RATING_SUPPORT,
    JUNGLE: StatGenerators.OVERALL_GAME_RATING_JUNGLER
}

export default function GameRatingOverview(props: GameRatingOverviewProps) {
    return (
        <Fade in={true} style={{ transitionDelay: '600ms'}}>
            <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
                {
                    [EARLY_GAME_RATING_BY_ROLE, LATE_GAME_RATING_BY_ROLE, OVERALL_GAME_RATING_OVERVIEW].map(gameRatingMap => {
                        return <GameRating
                            hasData={props.playerStats.length > 0}
                            title={gameRatingMap[props.roleId].getStatTitle()}
                            tooltip={gameRatingMap[props.roleId].getToolTip()}
                            rating={gameRatingMap[props.roleId].getStatString(props.playerStats)}
                            rank={getRatingByValue(gameRatingMap[props.roleId].getStatNumber(props.playerStats))}/>
                    })
                }
            </Box>
        </Fade>

    );
}

function getRatingByValue(val: number): Rank {
    if(val > 100) {
        return Rank.SPLUS
    }
    else if(val > 90) {
        return Rank.S
    }
    else if(val > 70) {
        return Rank.A
    }
    else if(val > 50) {
        return Rank.B
    }
    else if(val > 30) {
        return Rank.C
    }
    else {
        return Rank.D
    }
}