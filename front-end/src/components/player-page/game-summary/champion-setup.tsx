import PlayerGameModel from "../../../../../Common/models/playergame.model";
import {Box, Typography} from "@mui/material";
import {GameTypeToString} from "../../../../../Common/utils";
import React from "react";

interface ChampionSetupProps {
    mainPlayer: PlayerGameModel
    gameType: number,
    seasonId: number
}

function ChampionSetup(championSetupProps: ChampionSetupProps) {
    return <Box sx={{pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Box sx={{display: "inline-flex"}}>
            <Box sx={{pl: 1, pr: 1}}>
                <img src={`/images/champions/icons/${championSetupProps.mainPlayer.championId}_0.png`}
                     alt={`${championSetupProps.mainPlayer.championId}`}
                     height="50px"
                     width="50px"/>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <img src={`/images/summoner/${championSetupProps.mainPlayer.summoner1Id}.png`}
                     alt={`${championSetupProps.mainPlayer.summoner1Id}`}
                     height="25px"
                     width="25px"/>
                <img src={`/images/summoner/${championSetupProps.mainPlayer.summoner2Id}.png`}
                     alt={`${championSetupProps.mainPlayer.summoner2Id}`}
                     height="25px"
                     width="25px"/>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", pl: .4}}>
                <img src={`/images/runes/${championSetupProps.mainPlayer.primaryRunes[0]}.png`}
                     alt={`${championSetupProps.mainPlayer.primaryRunes[0]}`}
                     height="25px"
                     width="25px"/>
                <img src={`/images/runes/${championSetupProps.mainPlayer.secondaryStyle}.png`}
                     alt={`${championSetupProps.mainPlayer.secondaryStyle}`}
                     height="25px"
                     width="25px"/>
            </Box>
        </Box>
        <Box>
            <Typography variant="body2" align="center">
                {GameTypeToString(championSetupProps.gameType, championSetupProps.seasonId)}
            </Typography>
        </Box>
    </Box>;
}

export default ChampionSetup;