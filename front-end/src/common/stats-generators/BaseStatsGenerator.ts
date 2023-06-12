import { Theme } from '@mui/material';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

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

    abstract getStatValue(playerStatsModel: PlayerStatModel): number;

    abstract getStatTitle(): string;

    abstract getToolTip(): string;

    protected shouldInvertLeaderboard = false;

    getNoDataValue(): String {
      return '';
    }

    canLoadData(playerStatModels: PlayerStatModel[]): boolean {
      return playerStatModels.length > 0;
    }

    formatNumber(value: number, decimals: number = 2) : string {
      // We always want to keep the numbers below 6 characters to fit in the box
      return value.toFixed(decimals).length > 6 ? value.toFixed(1) : value.toFixed(decimals);
    }

    getSortValue(playerStatsModel: PlayerStatModel) {
      return this.getStatValue(playerStatsModel);
    }

    getStatNumber(playerStatsModels: PlayerStatModel[]) {
      let total = 0;
      let games = 0;
      for (let playerStatsModel of playerStatsModels) {
        const weight1 = games / (games + playerStatsModel.games);
        const weight2 = 1 - weight1;
        total = (total * weight1) + (weight2 * this.getStatValue(playerStatsModel));
        games += playerStatsModel.games;
      }
      return total;
    }

    getStatSum(playerStatModels: PlayerStatModel[]) {
      return playerStatModels.reduce((acc, curModel) => acc + this.getStatValue(curModel), 0);
    }

    getStatString(playerStatsModels: PlayerStatModel[], decimals: number = 2): string {
      return `${this.formatNumber(this.getStatNumber(playerStatsModels), decimals)}` ;
    }

    getSortedLeaderboard(unsortedLeaderboard: PlayerStatModel[]): PlayerStatModel[] {
      const sortedLeaderboard = unsortedLeaderboard.sort((o1, o2) => {
        return this.getSortValue(o2) - this.getSortValue(o1);
      });
      return this.shouldInvertLeaderboard ?  sortedLeaderboard.reverse() : sortedLeaderboard;
    }

    getPositionInLeaderboard(value: number, sortedLeaderboard: PlayerStatModel[]): number {
      for (const i in sortedLeaderboard) {
        if (value >= this.getStatValue(sortedLeaderboard[i])) {
          return +i+1;
        }
      }
      return sortedLeaderboard.length + 1;
    }
}