import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalTowersTakenStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TTT';
  }

  getToolTip(): string {
    return 'Total Towers taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.turretTakedowns;
  }
}