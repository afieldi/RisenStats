import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { riotTimestampToMinutes } from '../../../../Common/utils';

export class DPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'DPM';
    }

    getToolTip(): string {
        return 'Damage Per Min';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions/ riotTimestampToMinutes(playerStatsModel.gameLength);
    }
}