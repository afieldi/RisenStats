import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalBasicPingStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TBP';
  }

  getToolTip(): string {
    return 'Basic Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.basicPings;
  }
}