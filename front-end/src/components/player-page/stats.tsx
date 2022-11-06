import React from "react";
import {
    Box,
} from "@mui/material";
import PerformanceOverview from "./stats/performance-overview";
import SeasonModel from "../../../../Common/models/season.model";
import FilterBar from "./stats/filter-bar";
import ChampionOverview from "./stats/champion-overview";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import WinRateBox from "./stats/win-rate-box";
import RisenBox1 from "../risen-box/risen-box-1";
import {GameRoles} from "../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import {BaseStatGenerator} from "./stats/stats-generators/BaseStatsGenerator";
import {KDAStatGenerator} from "./stats/stats-generators/KDAStatGenerator";
import {KPAStatGenerator} from "./stats/stats-generators/KPAStatGenerator";
import {AverageVisionScoreStatGenerator} from "./stats/stats-generators/AverageVisionScoreStatGenerator";
import {DeathPercentStatGenerator} from "./stats/stats-generators/DeathPercentStatGenerator";
import {DPGStatGenerator} from "./stats/stats-generators/DPGStatGenerator";
import {CSPMStatGenerator} from "./stats/stats-generators/CSPMStatGenerator";
import {DPMStatGenerator} from "./stats/stats-generators/DPMStatGenerator";
import {GoldShareStatGenerator} from "./stats/stats-generators/GoldShareStatGenerator";
import {VisionScorePercentStatGenerator} from "./stats/stats-generators/VisionScorePercentStatGenerator";
import {DMGPercentStatGenerator} from "./stats/stats-generators/DMGPercentStatGenerator";
import {GPMStatGenerator} from "./stats/stats-generators/GPMStatGenerator";

interface PlayerPageStatsProps {
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
    roleConfig?: {
        roleId: GameRoles,
        setRoleId: (roleId: GameRoles) => void,
    };
    championData: PlayerChampionStatsModel[]
    playerStats: PlayerStatModel[]
}

const statsGenerators: BaseStatGenerator[] = [
    new KDAStatGenerator(),
    new KPAStatGenerator(),
    new AverageVisionScoreStatGenerator(),
    new CSPMStatGenerator(),
    new DeathPercentStatGenerator(),
    new DPGStatGenerator(),
    new DPMStatGenerator(),
    new GoldShareStatGenerator(),
    new VisionScorePercentStatGenerator(),
    new DMGPercentStatGenerator(),
    new GPMStatGenerator()
]

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
                        <WinRateBox wins={wins} losses={games-wins}/>
                        <ChampionOverview championData={this.props.championData}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <PerformanceOverview statsGenerators={statsGenerators} playerStats={this.props.playerStats}/>
                        <RisenBox1 sx={{minHeight: 480}}>THIS SECTION IS COMING SOON</RisenBox1>
                    </Box>
                </Box>
            </Box>

        );
    }
}