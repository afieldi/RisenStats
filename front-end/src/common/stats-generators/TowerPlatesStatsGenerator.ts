import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export class TowerPlatesStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TPTPG';
    }

    getToolTip(): string {
        return 'Tower Plates Taken Per Game';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.turretPlatesTaken / playerStatsModel.games;
    }
}