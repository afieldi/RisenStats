import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class CSPMStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let cs = 0
        let time = 0;
        for (let playerStatsModel of playerStatsModels) {
            cs += playerStatsModel.totalMinionsKilled;
            time += playerStatsModel.gameLength;
        }

        let minutes = time / 60
        return `${this.formatNumber(cs/minutes)}` ;
    }

    getStatTitle(): string {
        return "CSPM"
    }

    getToolTip(): string {
        return "CS Per Min";
    }
}