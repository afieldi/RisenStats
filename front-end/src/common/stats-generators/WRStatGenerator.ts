import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { roundTo } from '../../../../Common/utils';

export class WRStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'WR';
  }

  getToolTip(): string {
    return 'Win Rate';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return roundTo((playerStatsModel.win / playerStatsModel.games)*100);
  }
}