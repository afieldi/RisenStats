import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export class KDAStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'KDA';
  }

  getToolTip(): string {
    return 'Kills + Assists / Deaths';
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return (playerStatsModel.kills + playerStatsModel.assists) /
            (playerStatsModel.deaths === 0 ? 1 : playerStatsModel.deaths);
  }
}