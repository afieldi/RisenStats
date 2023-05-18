import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export class HeraldKillsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'RHTPG';
    }

    getToolTip(): string {
        return 'Rift Herald Taken Per Game';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.riftHeraldTakedowns / playerStatsModel.games;
    }
}