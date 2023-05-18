import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { TotalStatGenerator } from './TotalStatGenerator';

export class TotalElderDragonKillsStatGenerator extends TotalStatGenerator {
    getStatTitle(): string {
        return 'TED';
    }

    getToolTip(): string {
        return 'Total Elder Dragons Taken';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.teamElderDragonKills;
    }
}