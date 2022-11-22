import {useTheme} from "@emotion/react";
import {Box, Grow, Theme, Tooltip, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import LeaderboardRanking from "./leaderboard-ranking";

interface StatBoxProps {
    statTitle: String
    statValue: String
    statToolTip: String
    haveStatsLoaded: boolean
    leaderboardRank: number;
    leagueAvg: number;
}

export default function StatBox(statBoxProps: StatBoxProps) {
    const theme = useTheme() as Theme;

    // Base the side of the statsTitle based on the characters so it fits in the box
    const typographySize = statBoxProps.statTitle.length < 8 ? "subtitle2" : "caption";

    return (
        <RisenBox1 sx={{minWidth: 110, maxWidth: 110, minHeight: 110, maxHeight: 110}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {!statBoxProps.haveStatsLoaded &&
                    <Typography color={theme.palette.info.light} variant="subtitle2">
                        <Tooltip title={"No data available, maybe press the update button?"}><div>No Data</div></Tooltip>
                    </Typography>
                }
                <Grow in={statBoxProps.haveStatsLoaded} style={{ transitionDelay: '200ms'}}>
                    <div>
                        <Typography color={theme.palette.primary.main} variant="h6">
                            {statBoxProps.statValue}
                        </Typography>
                        <Typography color={theme.palette.info.light} variant={typographySize}>
                            <Tooltip title={statBoxProps.statToolTip}><div>{statBoxProps.statTitle}</div></Tooltip>
                        </Typography>
                        {statBoxProps.haveStatsLoaded && <LeaderboardRanking rank={statBoxProps.leaderboardRank} leagueAvg={statBoxProps.leagueAvg}/>}
                    </div>
                </Grow>
            </Box>
        </RisenBox1>
    )
}