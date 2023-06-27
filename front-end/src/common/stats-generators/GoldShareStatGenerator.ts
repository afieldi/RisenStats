import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class GoldShareStatGenerator extends PercentBaseStatGenerator {
  getStatTitle(): string {
    return 'Gold %';
  }

  getToolTip(): string {
    return 'Avg Share of the gold per game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return  playerStatsModel.goldEarned/playerStatsModel.totalGoldOfTeam * 100;
  }
}