import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {TotalStatGenerator} from "./TotalStatGenerator";

export class TotalTowersTakenStatsGenerator extends TotalStatGenerator {
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