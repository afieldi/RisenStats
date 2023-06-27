import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalBaitPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TPB';
  }

  getToolTip(): string {
    return 'Bait Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.baitPings;
  }
}