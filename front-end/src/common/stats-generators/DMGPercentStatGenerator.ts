import PlayerStatModel from '../../../../Common/models/playerstat.model';
import { PercentBaseStatGenerator } from './PercentBaseStatGenerator';

export class DMGPercentStatGenerator extends PercentBaseStatGenerator {
    getStatTitle(): string {
        return 'DMG %';
    }

    getToolTip(): string {
        return 'Damage Share';
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions / playerStatsModel.totalDamageDealtToChampionsOfTeam * 100;
    }
}