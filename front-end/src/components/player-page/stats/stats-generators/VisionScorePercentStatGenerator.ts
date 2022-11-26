import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class VisionScorePercentStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "VS %"
    }

    getToolTip(): string {
        return "Share of vision score per game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.visionScore / playerStatsModel.totalVisionScoreOfTeam * 100;
    }

    formatNumber(value: number): string {
        return `${super.formatNumber(value)}%`;
    }
}