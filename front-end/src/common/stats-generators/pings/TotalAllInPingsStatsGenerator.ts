import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalAllInPingsStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TAIP';
    }

    getToolTip(): string {
        return 'All In Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.allInPings;
    }
}