import { Theme } from "@mui/material";
import PlayerStatModel from "../../../../Common/models/playerstat.model";

export abstract class BaseStatGenerator {

    static getColor(stat: number, theme: Theme): string {
        return theme.palette.text.primary;
    }

    static getColorHelper(stat: number, theme: Theme, bp1: number, bp2: number, bp3: number): string {
        if (stat >= bp1)
            return theme.palette.first.main;
        else if (stat >= bp2)
            return theme.palette.second.main;
        else if (stat >= bp3)
            return theme.palette.third.main;
        return theme.palette.text.primary;
    }

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

    formatNumber(value: number, decimals: number = 2) : string {
        // We always want to keep the numbers below 6 characters to fit in the box
        return value.toFixed(decimals).length > 6 ? value.toFixed(1) : value.toFixed(decimals)
    }

    getStatString(playerStatsModels: PlayerStatModel[], decimals: number = 2): string {
        let total = 0
        let roles = 0;
        for (let playerStatsModel of playerStatsModels) {
            total += this.getStatValue(playerStatsModel)
            roles += 1
        }
        return `${this.formatNumber(total/roles, decimals)}` ;
    }

    getSortedLeaderboard(unsortedLeaderboard: PlayerStatModel[]): PlayerStatModel[] {
        const sortedLeaderboard = unsortedLeaderboard.sort((o1, o2) => {
            return this.getStatValue(o2) - this.getStatValue(o1);
        })
        return this.shouldInvertLeaderboard ?  sortedLeaderboard.reverse() : sortedLeaderboard;
    }
}