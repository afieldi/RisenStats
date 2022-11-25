import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DPGStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DPG"
    }

    getToolTip(): string {
        return "Damage Per Gold";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions / playerStatsModel.goldEarned;
    }
}