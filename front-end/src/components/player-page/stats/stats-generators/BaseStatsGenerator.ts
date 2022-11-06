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
        return value.toFixed(2)
    }
}