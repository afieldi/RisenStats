import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { riotTimestampToMinutes } from '../../../../Common/utils';

export class CSPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'CSPM';
    }

    getToolTip(): string {
        return 'CS Per Min';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return (playerStatsModel.totalMinionsKilled + playerStatsModel.enemyJungleMonsterKills + playerStatsModel.alliedJungleMonsterKills) /  riotTimestampToMinutes(playerStatsModel.gameLength);
    }
}