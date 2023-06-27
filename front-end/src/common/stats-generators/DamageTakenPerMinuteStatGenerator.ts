import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { riotTimestampToMinutes } from '../../../../Common/utils';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class DamageTakenPerMinuteStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'DTPM';
  }

  getToolTip(): string {
    return 'Damage Taken Per Min';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.totalDamageTaken / riotTimestampToMinutes(playerStatsModel.gameLength);
  }
}