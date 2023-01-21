import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalVisionClearedPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TVC"
    }

    getToolTip(): string {
        return "Vision Cleared Pings";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.visionClearedPings;
    }
}