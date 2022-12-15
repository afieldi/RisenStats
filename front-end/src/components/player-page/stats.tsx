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
import FilterBar from "../filters/filter-bar";
import ObjectiveOverview from "./stats/objective-overview";
import GameRatingOverview from "./stats/game-rating-overview";

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
    leaderboardData?: PlayerStatModel[]
    playerPuuid?: string
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
                <FilterBar seasonConfig={this.props.seasonConfig} roleConfig={this.props.roleConfig}/>
                <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 3}}>
                    <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <WinRateBox hasData={this.props.playerStats.length > 0} wins={wins} losses={games-wins}/>
                        <ChampionOverview championData={this.props.championData}/>
                        <ObjectiveOverview playerStats={this.props.playerStats}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <PerformanceOverview    playerStats={this.props.playerStats}
                                                playerPuuid={this.props.playerPuuid}
                                                leaderboardStats={this.props.leaderboardData ? this.props.leaderboardData : []}
                        />
                        <Box sx={{minHeight: 480, display: 'flex', flexDirection: 'row', columnGap: 2}}>
                            <GameRatingOverview playerStats={this.props.playerStats}
                                                roleId={!!this.props.roleConfig?.roleId ? this.props.roleConfig.roleId : GameRoles.ALL}/>
                            <RisenBox1>
                                <Typography variant="subtitle1">THIS SECTION IS COMING SOON</Typography>
                                <Typography variant="subtitle1">DM soulbert#7829 with bugs/suggestions</Typography>
                            </RisenBox1>
                            <RisenBox1>
                                <Typography variant="subtitle1">THIS SECTION IS COMING SOON</Typography>
                                <Typography variant="subtitle1">DM soulbert#7829 with bugs/suggestions</Typography>
                            </RisenBox1>
                        </Box>
                    </Box>
                </Box>
            </Box>

        );
    }
}