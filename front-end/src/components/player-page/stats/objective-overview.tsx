import {useTheme} from "@emotion/react";
import {Box, Divider, Fade, Grow, Theme, Typography} from "@mui/material";
import React from "react";
import RisenBox1 from "../../risen-box/risen-box-1";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {BaseStatGenerator} from "../../../common/stats-generators/BaseStatsGenerator";
import {StatGenerators} from "../../../common/utils";
import {AllObjectives, Dragons, Objectives} from "../../../common/types";


interface ChampionOverviewProps {
    playerStats: PlayerStatModel[]
}

// We need to do this because i couldnt find all the files we need as SVGs. So some of the files are in .svg format while some are in .png format
// TODO find all files as SVGs
const ObjectiveToPath: Record<AllObjectives, string> = {
    Chemtech: "/images/game/Chemtech-dragon.png",
    Cloud: "/images/game/Cloud-dragon.svg",
    Elder: "/images/game/Elder-dragon.svg",
    Herald: "/images/game/Herald.svg",
    Hextech: "/images/game/Hextech-dragon.svg",
    Infernal: "/images/game/Infernal-dragon.svg",
    Mountain: "/images/game/Mountain-dragon.svg",
    Ocean: "/images/game/Ocean-dragon.svg",
    Plates: "/images/game/Plates.png",
    Tower: "/images/game/Tower.png",
    Baron : "/images/game/Baron.svg"
}

const objectives: Record<Objectives, BaseStatGenerator> = {
    Elder : StatGenerators.TOTAL_ELDER,
    Herald : StatGenerators.TOTAL_HERALD,
    Baron : StatGenerators.TOTAL_BARON,
    Tower: StatGenerators.TOTAL_TOWERS,
    Plates: StatGenerators.TOTAL_TOWER_PLATES
}

export default function ObjectiveOverview(props: ChampionOverviewProps) {
    const theme = useTheme() as Theme;
    const hasStats = props.playerStats.length > 0;
    return (
        <RisenBox1>
            <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left"
                        variant="subtitle1">OBJECTIVES</Typography>
            <Divider sx={{marginBottom: 2}}/>
            {hasStats &&
                <Box>
                    <Fade in={true} style={{ transitionDelay: '50ms'}}>
                        <Box sx={{display: "flex", columnGap: 4, rowGap: 1}}>
                            { Object.keys(objectives).map((key) => ObjectiveStat(key as Objectives, objectives[key as Objectives], props.playerStats ))}
                        </Box>
                    </Fade>
                    <Box sx={{marginBottom: 2}}/>
                    { getDragonObjectiveStat(StatGenerators.TOTAL_DRAGON, props.playerStats) }
                </Box>
            }

        </RisenBox1>
    );
}

function ObjectiveStat(objectiveType: Objectives, statGenerator: BaseStatGenerator, playerStats: PlayerStatModel[]) {
    return (
        <Box sx={{display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent:"center"}}>
            {getObjectiveImg(objectiveType)}
            <Typography fontFamily="Montserrat" align="center"
                        variant="button">{statGenerator.getStatString(playerStats, 0)}</Typography>
        </Box>
    );
}

function getDragonObjectiveStat(statGenerator: BaseStatGenerator, playerStats: PlayerStatModel[]) {
    return (
        <Box sx={{display: "flex", rowGap: 1, flexDirection:"column"}}>
            <Box sx={{display: "flex", flexDirection:"row", justifyContent: "center"}}>
                {Object.values(Dragons).map(dragonName => getObjectiveImg(dragonName as Dragons))}
            </Box>
            <Typography fontFamily="Montserrat" align="center"
                        variant="button">{statGenerator.getStatString(playerStats, 0)}</Typography>
        </Box>
    );
}

function getObjectiveImg(objectiveType: AllObjectives) {
    return (
        <img alt={objectiveType}
             src={ObjectiveToPath[objectiveType]}
             height="25px"
             width="25px"/>
    )
}