import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalNeedVisionPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TNV';
  }

  getToolTip(): string {
    return 'Need Vision Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.needVisionPings;
  }
}