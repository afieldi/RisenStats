import { BaseStatGenerator } from './BaseStatsGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class VoidgrubKillsStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'VGTPG';
  }

  getToolTip(): string {
    return 'Average Void Grubs Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.voidgrubKills / playerStatsModel.games;
  }
}