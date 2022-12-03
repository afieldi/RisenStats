import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class TotalDragonKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TOTAL RH"
    }

    getToolTip(): string {
        return "Total Dragons Taken Per Game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.dragonTakedowns;
    }
}