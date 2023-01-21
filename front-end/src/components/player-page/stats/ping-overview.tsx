import {Box, Fade, Theme, Tooltip, Typography} from "@mui/material";
import React from "react";
import BaseRisenBox from "../../risen-box/base-risen-box";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {useTheme} from "@emotion/react";
import {playerStatsHasData} from "../../../../../Common/utils";
import {StatGenerators} from "../../../common/constants";
import {BaseStatGenerator} from "../../../common/stats-generators/BaseStatsGenerator";

interface PingOverviewProps {
    playerStats: PlayerStatModel[]
}

export const pings: Record<string, BaseStatGenerator> = {
    "/images/game/pings/all_in.png" : StatGenerators.TOTAL_ALL_IN_PINGS,
    "/images/game/pings/assist.png" : StatGenerators.TOTAL_ASSIST_ME_PINGS,
    "/images/game/pings/ping.png" : StatGenerators.TOTAL_BASIC_PINGS,
    "/images/game/pings/bait.png" : StatGenerators.TOTAL_BAIT_PINGS,
    "/images/game/pings/mia.png" : StatGenerators.TOTAL_ENEMY_MISSING_PINGS,
    "/images/game/pings/area_is_warded.png" : StatGenerators.TOTAL_ENEMY_VISION_PINGS,
    "/images/game/pings/caution.png" : StatGenerators.TOTAL_GET_BACK_PING,
    "/images/game/pings/hold.png" : StatGenerators.TOTAL_HOLD_PING,
    "/images/game/pings/need_ward.png" : StatGenerators.TOTAL_NEED_VISION_PING,
    "/images/game/pings/on_my_way.png" : StatGenerators.TOTAL_ON_MY_WAY_PINGS,
    "/images/game/pings/push.png" : StatGenerators.TOTAL_PUSH_PINGS,
    "/images/game/pings/cleared.png" : StatGenerators.TOTAL_VISION_CLEARED_PINGS
    // TODO add the command and danger ping
}

export default function PingOverview(props: PingOverviewProps) {
    const theme = useTheme() as Theme;

    return (
        <BaseRisenBox sx={{minWidth: 250, maxWidth: 270}} title="Ping Stats">
            {
                !playerStatsHasData(props.playerStats) && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>
            }
            <Box sx={{display: "flex", columnGap: 3, rowGap: 1}}>
                {
                    playerStatsHasData(props.playerStats) &&
                    Object.keys(pings)
                        .map((key) => {
                            return (
                                <Fade in={true} style={{ transitionDelay: '300ms'}}>
                                    { getRow(theme, key, pings[key]) }
                                </Fade>
                            )
                        })
                }
            </Box>
        </BaseRisenBox>
    );
}

function getRow(theme: Theme, src: string, statGenerator: BaseStatGenerator) {
    return (
        <Box>
            <Tooltip title={"TEMP"} sx={{display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent:"center"}}>
                {getImg(src)}
            </Tooltip>
            <Box sx={{width: "30px"}}>
                <Typography  fontFamily="Montserrat" align="center"
                             variant="button">1</Typography>
            </Box>

        </Box>
    );
}

function getImg(src: string) {
    return (
        <img alt={""}
             src={src}
             height="25px"
             width="25px"/>
    )
}