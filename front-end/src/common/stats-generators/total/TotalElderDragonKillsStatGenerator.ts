import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalElderDragonKillsStatGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TED';
  }

  getToolTip(): string {
    return 'Total Elder Dragons Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.teamElderDragonKills;
  }
}