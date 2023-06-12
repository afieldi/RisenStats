import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalPushPingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TP';
  }

  getToolTip(): string {
    return 'Push Pings';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.pushPings;
  }
}