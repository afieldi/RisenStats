import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { BaseStatGenerator } from './BaseStatsGenerator';

export class VisionScorePerMinuteStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'VSPM';
  }

  getToolTip(): string {
    return 'Vision Score Per Minute';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.visionScorePerMinute / playerStatsModel.games;
  }
}