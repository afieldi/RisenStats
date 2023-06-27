import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalCommandPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TCP';
  }

  getToolTip(): string {
    return 'Command Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.commandPings;
  }
}