import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export abstract class BaseStatGenerator {

    abstract getStatValue(playerStatsModel: PlayerStatModel): number

    abstract getStatTitle(): string

    abstract getToolTip(): string;

    protected shouldInvertLeaderboard = false

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

    getStatString(playerStatsModels: PlayerStatModel[]): string {
        let total = 0
        let roles = 0;
        for (let playerStatsModel of playerStatsModels) {
            total += this.getStatValue(playerStatsModel)
            roles += 1
        }
        return `${this.formatNumber(total/roles)}` ;
    }

    getSortedLeaderboard(unsortedLeaderboard: PlayerStatModel[]): PlayerStatModel[] {
        const sortedLeaderboard = unsortedLeaderboard.sort((o1, o2) => {
            return this.getStatValue(o2) - this.getStatValue(o1);
        })
        return this.shouldInvertLeaderboard ?  sortedLeaderboard.reverse() : sortedLeaderboard;
    }
}