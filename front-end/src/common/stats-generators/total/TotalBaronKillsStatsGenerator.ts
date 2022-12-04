import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalBaronKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TB"
    }

    getToolTip(): string {
        return "Total Barons Taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.baronTakedowns;
    }
}