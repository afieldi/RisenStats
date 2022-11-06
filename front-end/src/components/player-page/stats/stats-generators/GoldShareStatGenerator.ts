import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class GoldShareStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let gold = 0
        let totalGoldOnTeam = 0;
        for (let playerStatsModel of playerStatsModels) {
            gold += playerStatsModel.goldEarned;
            totalGoldOnTeam += playerStatsModel.totalGoldOfTeam;
        }
        return `${this.formatNumber(gold/totalGoldOnTeam * 100)}%` ;
    }

    getStatTitle(): string {
        return "Gold %"
    }

    getToolTip(): string {
        return "Avg Share of the gold per game";
    }
}