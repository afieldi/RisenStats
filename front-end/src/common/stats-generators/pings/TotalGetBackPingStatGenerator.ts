import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalGetBackPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TGB';
  }

  getToolTip(): string {
    return 'Get Back Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.getBackPings;
  }
}