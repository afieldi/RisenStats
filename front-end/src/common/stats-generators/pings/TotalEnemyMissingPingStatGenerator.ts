import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalEnemyMissingPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TEMP';
  }

  getToolTip(): string {
    return 'Enemy Missing Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.enemyMissingPings;
  }
}