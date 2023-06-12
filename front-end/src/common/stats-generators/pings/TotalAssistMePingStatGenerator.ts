import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalAssistMePingStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'TAMP';
  }

  getToolTip(): string {
    return 'Assist Me Pings';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return playerStatsModel.assistMePings;
  }
}