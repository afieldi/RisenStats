import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { riotTimestampToMinutes } from '../../../../Common/utils';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DPMStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'DPM';
  }

  getToolTip(): string {
    return 'Damage Per Min';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.totalDamageDealtToChampions/ riotTimestampToMinutes(playerStatsModel.gameLength);
  }
}