import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalAssistMePingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TAMP';
  }

  getToolTip(): string {
    return 'Assist Me Pings';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.assistMePings;
  }
}