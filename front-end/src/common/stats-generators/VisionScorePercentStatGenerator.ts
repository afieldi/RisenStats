import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';

export class VisionScorePercentStatGenerator extends PercentBaseStatGenerator {
    getStatTitle(): string {
        return 'VS %';
    }

    getToolTip(): string {
        return 'Share of vision score per game';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.visionScore / playerStatsModel.totalVisionScoreOfTeam * 100;
    }
}