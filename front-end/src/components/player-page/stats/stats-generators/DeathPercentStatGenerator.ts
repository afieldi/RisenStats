import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DeathPercentStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "Death %"
    }

    getToolTip(): string {
        return "Avg Share of Deaths per game";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return  (playerStatsModel.deaths/ playerStatsModel.totalDeathsOfTeam) * 100;
    }
}