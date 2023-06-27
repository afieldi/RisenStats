import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class VisionScorePercentStatGenerator extends PercentBaseStatGenerator {
  getStatTitle(): string {
    return 'VS %';
  }

  getToolTip(): string {
    return 'Share of vision score per game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.visionScore / playerStatsModel.totalVisionScoreOfTeam * 100;
  }
}