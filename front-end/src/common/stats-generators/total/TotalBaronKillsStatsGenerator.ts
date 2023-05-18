import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';

export class TotalBaronKillsStatsGenerator extends TotalStatGenerator {
    getStatTitle(): string {
        return 'TB';
    }

    getToolTip(): string {
        return 'Total Barons Taken';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.baronTakedowns;
    }
}