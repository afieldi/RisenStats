import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class KPPercentStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "KP%"
    }

    getToolTip(): string {
        return "Kills + Assists / TotalKills";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return (playerStatsModel.kills + playerStatsModel.assists) / (playerStatsModel.totalKillsOfTeam) * 100;
    }

    formatNumber(value: number): string {
        return `${super.formatNumber(value)}%`;
    }
}