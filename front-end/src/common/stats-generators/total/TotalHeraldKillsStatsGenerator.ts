import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class TotalHeraldKillsStatsGenerator extends TotalStatGenerator {
  getStatTitle(): string {
    return 'TRH';
  }

  getToolTip(): string {
    return 'Total Rift Herald Taken';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.riftHeraldTakedowns;
  }
}