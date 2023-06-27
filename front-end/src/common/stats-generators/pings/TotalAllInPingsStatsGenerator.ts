import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalAllInPingsStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TAIP';
  }

  getToolTip(): string {
    return 'All In Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.allInPings;
  }
}