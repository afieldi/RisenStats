import {Box, Fade, Theme, Typography} from "@mui/material";
import React from "react";
import BaseRisenBox from "../../risen-box/base-risen-box";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {useTheme} from "@emotion/react";
import {playerStatsHasData} from "../../../../../Common/utils";
import {StatGenerators} from "../../../common/constants";
import {TotalAllInPingsStatsGenerator} from "../../../common/stats-generators/pings/TotalAllInPingsStatsGenerator";
import {TotalAssistMePingStatGenerator} from "../../../common/stats-generators/pings/TotalAssistMePingStatGenerator";
import {TotalBasicPingStatsGenerator} from "../../../common/stats-generators/pings/TotalBasicPingStatsGenerator";
import {TotalBaitPingStatGenerator} from "../../../common/stats-generators/pings/TotalBaitPingStatGenerator";
import {TotalEnemyMissingPingStatGenerator} from "../../../common/stats-generators/pings/TotalEnemyMissingPingStatGenerator";
import {TotalEnemyVisionPingStatGenerator} from "../../../common/stats-generators/pings/TotalEnemyVisionPingStatGenerator";
import {TotalGetBackPingStatGenerator} from "../../../common/stats-generators/pings/TotalGetBackPingStatGenerator";
import {TotalHoldPingStatGenerator} from "../../../common/stats-generators/pings/TotalHoldPingStatGenerator";
import {TotalNeedVisionPingStatGenerator} from "../../../common/stats-generators/pings/TotalNeedVisionPingStatGenerator";
import {TotalOnMyWayPingStatGenerator} from "../../../common/stats-generators/pings/TotalOnMyWayPingStatGenerator";
import {TotalPushPingStatGenerator} from "../../../common/stats-generators/pings/TotalPushPingStatGenerator";
import {TotalVisionClearedPingStatGenerator} from "../../../common/stats-generators/pings/TotalVisionClearedPingStatGenerator";

interface PingOverviewProps {
    playerStats: PlayerStatModel[]
}

export default function PingOverview(props: PingOverviewProps) {
    const theme = useTheme() as Theme;

    return (
        <BaseRisenBox sx={{minWidth: 250, maxWidth: 270}} title="Ping Stats">
            {
                !playerStatsHasData(props.playerStats) && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>
            }
            {
                playerStatsHasData(props.playerStats) &&
                [
                    { "" : StatGenerators.TOTAL_ALL_IN_PINGS },
                    { "" : StatGenerators.TOTAL_ASSIST_ME_PINGS },
                    { "" : StatGenerators.TOTAL_BASIC_PINGS },
                    { "" : StatGenerators.TOTAL_BAIT_PINGS },
                    { "" : StatGenerators.TOTAL_ENEMY_MISSING_PINGS },
                    { "" : StatGenerators.TOTAL_ENEMY_VISION_PINGS },
                    { "" : StatGenerators.TOTAL_GET_BACK_PING },
                    { "" : StatGenerators.TOTAL_HOLD_PING },
                    { "" : StatGenerators.TOTAL_NEED_VISION_PING },
                    { "" : StatGenerators.TOTAL_ON_MY_WAY_PINGS },
                    { "" : StatGenerators.TOTAL_PUSH_PINGS },
                    { "" : StatGenerators.TOTAL_VISION_CLEARED_PINGS }
                ].map(statsgen => {
                    return (
                        <Fade in={true} style={{ transitionDelay: '300ms'}}>
                            { getRow(theme) }
                        </Fade>
                    )
                })
            }

        </BaseRisenBox>
    );
}

function getRow(theme: Theme) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 1, justifyContent: "space-between", alignContent: "center"}}>
            <Typography color={theme.palette.info.light} align="left" variant="subtitle1">IMAGE</Typography>
            <Typography align="left" variant="subtitle1">VALUE</Typography>
        </Box>
    )
}