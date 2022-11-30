import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export class SoloKillStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "SKPG"
    }

    getToolTip(): string {
        return "Solo Kills Per Game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.soloKills / playerStatsModel.games;
    }
}