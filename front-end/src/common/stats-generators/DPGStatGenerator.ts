import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DPGStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'DPG';
  }

  getToolTip(): string {
    return 'Damage Per Gold';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.totalDamageDealtToChampions / playerStatsModel.goldEarned;
  }
}