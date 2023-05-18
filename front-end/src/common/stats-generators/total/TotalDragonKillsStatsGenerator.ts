import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';

export class TotalDragonKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TD';
  }

  getToolTip(): string {
    return 'Total Dragons Taken';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.dragonTakedowns;
  }
}