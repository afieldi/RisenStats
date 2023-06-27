import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { riotTimestampToMinutes } from '../../../../Common/utils';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class GPMStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'GPM';
  }

  getToolTip(): string {
    return 'Gold Per Minute';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.goldEarned / riotTimestampToMinutes(playerStatsModel.gameLength);
  }
}