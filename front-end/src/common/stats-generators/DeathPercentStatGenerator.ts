import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DeathPercentStatGenerator extends PercentBaseStatGenerator {

  constructor() {
    super();
    this.shouldInvertLeaderboard = true;
  }

  getStatTitle(): string {
    return 'Death %';
  }

  getToolTip(): string {
    return 'Avg Share of Deaths per game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return  (playerStatsModel.deaths/ playerStatsModel.totalDeathsOfTeam) * 100;
  }
}