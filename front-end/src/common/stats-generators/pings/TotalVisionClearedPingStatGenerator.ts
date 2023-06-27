import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalVisionClearedPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TVC';
  }

  getToolTip(): string {
    return 'Vision Cleared Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.visionClearedPings;
  }
}