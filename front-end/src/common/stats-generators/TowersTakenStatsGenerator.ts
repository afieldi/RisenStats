import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export class TowersTakenStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TTPG';
    }

    getToolTip(): string {
        return 'Average Towers Taken Per Game';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.turretTakedowns / playerStatsModel.games;
    }
}