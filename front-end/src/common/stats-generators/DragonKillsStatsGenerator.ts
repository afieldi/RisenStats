import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DragonKillsStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'DTPG';
  }

  getToolTip(): string {
    return 'Average Dragons Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.dragonTakedowns / playerStatsModel.games;
  }
}