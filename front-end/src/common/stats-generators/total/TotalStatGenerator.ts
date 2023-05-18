import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { BaseStatGenerator } from '../BaseStatsGenerator';


export abstract class TotalStatGenerator extends BaseStatGenerator {
    getStatString(playerStatsModels: PlayerStatModel[], decimals: number = 2): string {
        let total = 0;
        for (let playerStatsModel of playerStatsModels) {
            total += this.getStatValue(playerStatsModel);
        }
        return `${this.formatNumber(total, decimals)}` ;
    }
}


