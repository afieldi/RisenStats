import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalHoldPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'THP';
  }

  getToolTip(): string {
    return 'Hold Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.holdPings;
  }
}