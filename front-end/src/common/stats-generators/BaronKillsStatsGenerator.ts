import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class BaronKillsStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'BTPG';
  }

  getToolTip(): string {
    return 'Average Number Of Barons Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.baronTakedowns / playerStatsModel.games;
  }
}