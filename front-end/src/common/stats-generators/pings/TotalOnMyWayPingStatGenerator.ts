import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalOnMyWayPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TOMW';
  }

  getToolTip(): string {
    return 'On My Way Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.onMyWayPings;
  }
}