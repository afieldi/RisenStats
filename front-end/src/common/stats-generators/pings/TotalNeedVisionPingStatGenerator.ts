import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalNeedVisionPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TNV';
  }

  getToolTip(): string {
    return 'Need Vision Pings';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.needVisionPings;
  }
}