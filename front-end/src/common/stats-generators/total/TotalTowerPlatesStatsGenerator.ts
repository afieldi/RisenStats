import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';

export class TotalTowerPlatesStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TTPT';
  }

  getToolTip(): string {
    return 'Total Tower Plates Taken';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.turretPlatesTaken;
  }
}