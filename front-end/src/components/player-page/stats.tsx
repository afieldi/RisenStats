import React from "react";
import {Box, Typography,} from "@mui/material";
import PerformanceOverview from "./stats/performance-overview";
import SeasonModel from "../../../../Common/models/season.model";
import ChampionOverview from "./stats/champion-overview";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import WinRateBox from "./stats/win-rate-box";
import RisenBox1 from "../risen-box/risen-box-1";
import {GameRoles} from "../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import GamesFilter from "../filters/games-filter";

interface PlayerPageStatsProps {
    seasonConfig: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons: SeasonModel[],
    };
    roleConfig?: {
        roleId: GameRoles,
        setRoleId: (roleId: GameRoles) => void,
    };
    championData: PlayerChampionStatsModel[]
    playerStats: PlayerStatModel[]
}

export default class PlayerPageStats extends React.Component<PlayerPageStatsProps> {

    render() {
        let wins = 0;
        let games = 0
        for (let playerStat of this.props.playerStats) {
            wins += playerStat.win;
            games += playerStat.games;
        }

        return (
            <Box>
                <GamesFilter seasonConfig={this.props.seasonConfig} roleConfig={this.props.roleConfig}/>
                <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 3}}>
                    <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <WinRateBox hasData={this.props.playerStats.length > 0} wins={wins} losses={games-wins}/>
                        <ChampionOverview championData={this.props.championData}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <PerformanceOverview playerStats={this.props.playerStats}/>
                        <RisenBox1 sx={{minHeight: 480}}>
                            <Typography variant="subtitle1">THIS SECTION IS COMING SOON</Typography>
                            <Typography variant="subtitle1">DM soulbert#7829 with bugs/suggestions</Typography>
                        </RisenBox1>
                    </Box>
                </Box>
            </Box>

        );
    }
}