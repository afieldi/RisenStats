import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DPGStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let gold = 0
        let damage = 0;
        for (let playerStatsModel of playerStatsModels) {
            gold += playerStatsModel.goldEarned;
            damage += playerStatsModel.totalDamageDealtToChampions;
        }
        return `${this.formatNumber(damage/gold)}` ;
    }

    getStatTitle(): string {
        return "DPG"
    }

    getToolTip(): string {
        return "Damage Per Gold";
    }
}