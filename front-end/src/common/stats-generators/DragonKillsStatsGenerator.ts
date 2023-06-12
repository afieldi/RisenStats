import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export class DragonKillsStatsGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'DTPG';
  }

  getToolTip(): string {
    return 'Average Dragons Taken Per Game';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.dragonTakedowns / playerStatsModel.games;
  }
}