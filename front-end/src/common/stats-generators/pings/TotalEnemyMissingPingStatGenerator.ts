import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalEnemyMissingPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TEMP';
    }

    getToolTip(): string {
        return 'Enemy Missing Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.enemyMissingPings;
    }
}