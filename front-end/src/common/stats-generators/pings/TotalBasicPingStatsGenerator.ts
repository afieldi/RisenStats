import { BaseStatGenerator } from '../BaseStatsGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

export class TotalBasicPingStatsGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return 'TBP';
    }

    getToolTip(): string {
        return 'Basic Pings';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.basicPings;
    }
}