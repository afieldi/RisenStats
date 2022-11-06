import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DeathPercentStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let deaths = 0
        let totalDeaths = 0;
        for (let playerStatsModel of playerStatsModels) {
            deaths += playerStatsModel.deaths;
            totalDeaths += playerStatsModel.totalDeathsOfTeam;
        }
        return `${this.formatNumber(deaths/totalDeaths * 100)}%` ;
    }

    getStatTitle(): string {
        return "Death %"
    }

    getToolTip(): string {
        return "Avg Share of Deaths per game";
    }
}