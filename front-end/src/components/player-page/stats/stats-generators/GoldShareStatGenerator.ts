import PlayerStatModel from "../../../../../../Common/models/playerstat.model";
import {PercentBaseStatGenerator} from "./PercentBaseStatGenerator";

export class GoldShareStatGenerator extends PercentBaseStatGenerator {
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