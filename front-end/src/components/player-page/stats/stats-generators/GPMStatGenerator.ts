import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class GPMStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let gold = 0
        let time = 0;
        for (let playerStatsModel of playerStatsModels) {
            gold += playerStatsModel.goldEarned;
            time += playerStatsModel.gameLength;
        }

        let minutes = time / 60
        return `${this.formatNumber(gold/minutes)}` ;
    }

    getStatTitle(): string {
        return "GPM"
    }

    getToolTip(): string {
        return "Gold Per Minute";
    }
}