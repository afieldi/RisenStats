import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalAtakhanKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TA';
  }

  getToolTip(): string {
    return 'Total Atakhan Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.atakhanKills;
  }
}