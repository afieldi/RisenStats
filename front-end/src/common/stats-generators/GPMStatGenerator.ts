import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import {riotTimestampToMinutes} from "../../../../Common/utils";

export class GPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "GPM"
    }

    getToolTip(): string {
        return "Gold Per Minute";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.goldEarned / riotTimestampToMinutes(playerStatsModel.gameLength);
    }
}