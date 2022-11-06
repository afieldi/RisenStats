import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class VisionScorePercentStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let vs = 0
        let totalVSOfTeam = 0;
        for (let playerStatsModel of playerStatsModels) {
            vs += playerStatsModel.visionScore;
            totalVSOfTeam += playerStatsModel.totalVisionScoreOfTeam;
        }
        return `${this.formatNumber(vs/totalVSOfTeam * 100)}%` ;
    }

    getStatTitle(): string {
        return "VS %"
    }

    getToolTip(): string {
        return "Share of vision score per game";
    }
}