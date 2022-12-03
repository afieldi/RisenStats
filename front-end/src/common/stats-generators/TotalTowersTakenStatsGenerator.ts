import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class TotalTowersTakenStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TTT"
    }

    getToolTip(): string {
        return "Total Towers taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.turretTakedowns;
    }
}