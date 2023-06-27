import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { roundTo } from '../../../../Common/utils';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class WRStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'WR';
  }

  getToolTip(): string {
    return 'Win Rate';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return roundTo((playerStatsModel.win / playerStatsModel.games)*100);
  }
}