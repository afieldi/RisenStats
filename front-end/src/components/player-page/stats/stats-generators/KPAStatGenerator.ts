import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class KPAStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let kills = 0
        let assists = 0
        let totalKills = 0
        let totalAssists = 0

        for (let playerStatsModel of playerStatsModels) {
            kills += playerStatsModel.kills;
            assists += playerStatsModel.assists;
            totalAssists += playerStatsModel.totalAssistsOfTeam;
            totalKills += playerStatsModel.totalKillsOfTeam;
        }
        
        return `${this.formatNumber((kills + assists) / (totalKills) * 100)}%`;
    }

    getStatTitle(): string {
        return "KP%"
    }

    getToolTip(): string {
        return "Kills + Assists / TotalKills";
    }
}