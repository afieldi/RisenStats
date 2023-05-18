import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalEnemyVisionPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TEVP';
    }

    getToolTip(): string {
        return 'Enemy Vision Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.enemyVisionPings;
    }
}