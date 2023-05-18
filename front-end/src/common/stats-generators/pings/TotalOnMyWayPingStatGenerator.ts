import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalOnMyWayPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TOMW';
    }

    getToolTip(): string {
        return 'On My Way Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.onMyWayPings;
    }
}