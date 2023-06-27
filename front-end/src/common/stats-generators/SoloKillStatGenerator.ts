import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class SoloKillStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'SKPG';
  }

  getToolTip(): string {
    return 'Solo Kills Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.soloKills / playerStatsModel.games;
  }
}