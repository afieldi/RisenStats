import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalVoidgrubKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TVG';
  }

  getToolTip(): string {
    return 'Total Void Grubs Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.voidgrubKills;
  }
}