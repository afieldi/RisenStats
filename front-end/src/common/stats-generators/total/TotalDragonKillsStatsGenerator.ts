import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalDragonKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TD';
  }

  getToolTip(): string {
    return 'Total Dragons Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.dragonTakedowns;
  }
}