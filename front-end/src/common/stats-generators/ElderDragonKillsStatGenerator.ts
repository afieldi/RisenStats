import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export class ElderDragonKillsStatGenerator extends BaseStatGenerator {
  getStatTitle(): string {
    return 'EDTPG';
  }

  getToolTip(): string {
    return 'Elder Dragons Taken Per Game';
  }

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return playerStatsModel.teamElderDragonKills / playerStatsModel.games;
  }
}