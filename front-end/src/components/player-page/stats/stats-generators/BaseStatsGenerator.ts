import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export abstract class BaseStatGenerator {

    abstract getStatValue(playerStatsModels: PlayerStatModel[]): string

    abstract getStatTitle(): string

    abstract getToolTip(): string;

    getNoDataValue(): String {
        return ""
    }

    canLoadData(playerStatModels: PlayerStatModel[]): boolean {
        return playerStatModels.length > 0;
    }

    formatNumber(value: number) : string {
        // We always want to keep the numbers below 6 characters to fit in the box
        return value.toFixed(2).length > 6 ? value.toFixed(1) : value.toFixed(2)
    }
}