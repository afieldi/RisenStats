import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class SoloKillStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let soloKills = 0
        let games = 0
        for (let playerStatsModel of playerStatsModels) {
            soloKills += playerStatsModel.soloKills
            games += playerStatsModel.games;
        }

        return `${this.formatNumber(soloKills/games)}` ;
    }

    getStatTitle(): string {
        return "SKPG"
    }

    getToolTip(): string {
        return "Solo Kills Per Game";
    }
}