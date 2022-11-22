import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class GoldShareStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "Gold %"
    }

    getToolTip(): string {
        return "Avg Share of the gold per game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return  playerStatsModel.goldEarned/playerStatsModel.totalGoldOfTeam * 100;
    }
}