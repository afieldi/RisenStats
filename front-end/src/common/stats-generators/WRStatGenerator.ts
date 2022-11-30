import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class WRStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "WR"
    }

    getToolTip(): string {
        return "Win Rate";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.win / playerStatsModel.games;
    }
}