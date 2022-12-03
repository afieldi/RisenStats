import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class TotalElderDragonKillsStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "AVG ED"
    }

    getToolTip(): string {
        return "Average Elder Dragons Taken Per Game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.teamElderDragonKills;
    }
}