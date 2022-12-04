import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalTowerPlatesStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TTPT"
    }

    getToolTip(): string {
        return "Total Tower Plates Taken";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.turretPlatesTaken;
    }
}