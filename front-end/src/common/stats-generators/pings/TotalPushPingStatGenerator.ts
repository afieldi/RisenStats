import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalPushPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TP';
  }

  getToolTip(): string {
    return 'Push Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.pushPings;
  }
}