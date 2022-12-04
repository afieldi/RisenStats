import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalDragonKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TD"
    }

    getToolTip(): string {
        return "Total Dragons Taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.dragonTakedowns;
    }
}