import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class AverageVisionScoreStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let vs = 0
        let games = 0;
        for (let playerStatsModel of playerStatsModels) {
            vs += playerStatsModel.visionScore;
            games += playerStatsModel.games;
        }
        return `${this.formatNumber(vs/games)}` ;
    }

    getStatTitle(): string {
        return "AVG VS"
    }

    getToolTip(): string {
        return "Average Vision Score Per Game";
    }
}