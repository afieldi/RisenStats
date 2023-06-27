import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalDangerPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TDP';
  }

  getToolTip(): string {
    return 'Danger Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.dangerPings;
  }
}