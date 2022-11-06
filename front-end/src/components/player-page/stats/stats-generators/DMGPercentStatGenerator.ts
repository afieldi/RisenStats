import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DMGPercentStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let damage = 0;
        let totalDamageOfTeam = 0
        for (let playerStatsModel of playerStatsModels) {
            damage += playerStatsModel.totalDamageDealtToChampions;
            totalDamageOfTeam += playerStatsModel.totalDamageDealtToChampionsOfTeam;
        }
        return `${this.formatNumber(damage/totalDamageOfTeam * 100)}%` ;
    }

    getStatTitle(): string {
        return "DMG %"
    }

    getToolTip(): string {
        return "Damage Share";
    }
}