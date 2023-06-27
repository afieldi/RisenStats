import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalEnemyVisionPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TEVP';
  }

  getToolTip(): string {
    return 'Enemy Vision Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.enemyVisionPings;
  }
}