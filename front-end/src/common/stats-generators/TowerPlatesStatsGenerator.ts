import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class TowerPlatesStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TPTPG';
  }

  getToolTip(): string {
    return 'Tower Plates Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.turretPlatesTaken / playerStatsModel.games;
  }
}