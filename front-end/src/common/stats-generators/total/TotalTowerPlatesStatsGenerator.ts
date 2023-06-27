import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalTowerPlatesStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TTPT';
  }

  getToolTip(): string {
    return 'Total Tower Plates Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.turretPlatesTaken;
  }
}