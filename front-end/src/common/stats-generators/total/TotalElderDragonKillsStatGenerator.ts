import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalElderDragonKillsStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TED"
    }

    getToolTip(): string {
        return "Total Elder Dragons Taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.teamElderDragonKills;
    }
}