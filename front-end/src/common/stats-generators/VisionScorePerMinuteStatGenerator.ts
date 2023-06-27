import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { BaseStatGenerator } from './BaseStatsGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class VisionScorePerMinuteStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'VSPM';
  }

  getToolTip(): string {
    return 'Vision Score Per Minute';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.visionScorePerMinute / playerStatsModel.games;
  }
}