import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class KDAStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let kills = 0
        let deaths = 0
        let assists = 0
        for (let playerStatsModel of playerStatsModels) {
            kills += playerStatsModel.kills;
            deaths += playerStatsModel.deaths;
            assists += playerStatsModel.assists;
        }
        return `${this.formatNumber((kills + assists) / deaths)}` ;
    }

    getStatTitle(): string {
        return "KDA"
    }

    getToolTip(): string {
        return "Kills + Assists / Deaths";
    }
}