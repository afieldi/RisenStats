import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalHeraldKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TRH"
    }

    getToolTip(): string {
        return "Total Rift Herald Taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.riftHeraldTakedowns;
    }
}