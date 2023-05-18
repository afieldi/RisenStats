import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';

export class TotalHeraldKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TRH';
  }

  getToolTip(): string {
    return 'Total Rift Herald Taken';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.riftHeraldTakedowns;
  }
}