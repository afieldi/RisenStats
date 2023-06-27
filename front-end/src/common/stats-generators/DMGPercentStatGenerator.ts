import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DMGPercentStatGenerator extends PercentBaseStatGenerator {
  getStatTitle(): string {
    return 'DMG %';
  }

  getToolTip(): string {
    return 'Damage Share';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.totalDamageDealtToChampions / playerStatsModel.totalDamageDealtToChampionsOfTeam * 100;
  }
}