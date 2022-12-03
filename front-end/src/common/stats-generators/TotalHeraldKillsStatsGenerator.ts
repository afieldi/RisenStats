import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class TotalHeraldKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TOTAL RH"
    }

    getToolTip(): string {
        return "Total Rift Herald Taken Per Game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.riftHeraldTakedowns;
    }
}