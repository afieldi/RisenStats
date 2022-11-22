import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class AverageVisionScoreStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "AVG VS"
    }

    getToolTip(): string {
        return "Average Vision Score Per Game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.visionScore / playerStatsModel.games;
    }
}