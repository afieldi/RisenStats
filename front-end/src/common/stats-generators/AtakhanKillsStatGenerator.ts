import { BaseStatGenerator } from './BaseStatsGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class AtakhanKillsStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'ATPG';
  }

  getToolTip(): string {
    return 'Average Atakhans Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.atakhanKills / playerStatsModel.games;
  }
}