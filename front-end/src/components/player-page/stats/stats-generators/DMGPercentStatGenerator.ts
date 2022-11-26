import PlayerStatModel from "../../../../../../Common/models/playerstat.model";
import {BaseStatGenerator} from "./BaseStatsGenerator";

export class DMGPercentStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DMG %"
    }

    getToolTip(): string {
        return "Damage Share";
    }

    formatNumber(value: number): string {
        return `${super.formatNumber(value)}%`;
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions/ playerStatsModel.totalDamageDealtToChampionsOfTeam * 100;
    }
}