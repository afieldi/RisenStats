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

interface PlayerPageStatsProps {
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
    championData: PlayerChampionStatsModel[]
}

export interface PlayerStat {
    statValue: String
    statTitle: String
}

export default class PlayerPageStats extends React.Component<PlayerPageStatsProps> {
    render() {

        // TODO get this from props or on tab load
        let allPlayerStats: PlayerStat[] = [
            {statTitle: "GPM", statValue: "200"},
            {statTitle: "CSPM", statValue: "300"},
            {statTitle: "GPG", statValue: "1000"},
            {statTitle: "GPM", statValue: "1000"},
            {statTitle: "Vision Score", statValue: "1234"},
            {statTitle: "KP", statValue: "12345"},
            {statTitle: "XPD @15", statValue: "12345"},
            {statTitle: "XPD @25", statValue: "2326"},
            {statTitle: "K+A @ 15", statValue: "223"},
            {statTitle: "Gold Diff @ 25", statValue: "22"},
            {statTitle: "Gold %", statValue: "132"},
            {statTitle: "FB%", statValue: "3122"},
            {statTitle: "CSPM", statValue: "25"},
            {statTitle: "DMG %", statValue: "222"},

        ]

        return (
            <Box>
                <FilterBar seasonConfig={this.props.seasonConfig}/>
                <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 3}}>
                    <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <WinRateBox wins={20} losses={10}/>
                        <ChampionOverview championData={this.props.championData}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <PerformanceOverview allPlayerStats={allPlayerStats}/>
                        <RisenBox1 sx={{minHeight: 480}}>THIS SECTION IS COMING SOON</RisenBox1>
                    </Box>
                </Box>
            </Box>

        );
    }
}