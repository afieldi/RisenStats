import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalBaronKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TB';
  }

  getToolTip(): string {
    return 'Total Barons Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.baronTakedowns;
  }
}