import {Box} from "@mui/material";
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

const ranksByVal: Record<number, Rank> = {
    110: Rank.SPLUS,
    90: Rank.S,
    70: Rank.A,
    50: Rank.B,
    30: Rank.C,
    0: Rank.D,
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

export default function GameRatingOverview(props: GameRatingOverviewProps) {
    return (
        <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
            <GameRating title={"Early Game Rating"}
                        rating={EARLY_GAME_RATING_BY_ROLE[props.roleId].getStatString(props.playerStats)}
                        rank={getRatingByValue(EARLY_GAME_RATING_BY_ROLE[props.roleId].getStatNumber(props.playerStats))}/>
            <GameRating title={"Overall Game Rating"} rating={"1"} rank={Rank.D}/>
        </Box>
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