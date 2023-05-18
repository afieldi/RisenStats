import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalHoldPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'THP';
    }

    getToolTip(): string {
        return 'Hold Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.holdPings;
    }
}