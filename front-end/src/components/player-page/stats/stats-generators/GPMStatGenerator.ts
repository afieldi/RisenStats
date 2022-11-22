import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class GPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "GPM"
    }

    getToolTip(): string {
        return "Gold Per Minute";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        let minutes = playerStatsModel.gameLength / 60
        return playerStatsModel.goldEarned / minutes;
    }
}