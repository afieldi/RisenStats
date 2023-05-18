import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';

export class KPPercentStatGenerator extends PercentBaseStatGenerator {
  getStatTitle(): string {
    return 'KP%';
  }

  getToolTip(): string {
    return 'Kills + Assists / TotalKills';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return (playerStatsModel.kills + playerStatsModel.assists) / (playerStatsModel.totalKillsOfTeam) * 100;
  }
}