import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { BaseStatGenerator } from '../BaseStatsGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';


export abstract class TotalStatGenerator extends BaseStatGenerator {
  getStatString(playerStatsModels: AggregatedPlayerStatModel[], decimals: number = 2): string {
    let total = 0;
    for (let playerStatsModel of playerStatsModels) {
      total += this.getStatValue(playerStatsModel);
    }
    return `${this.formatNumber(total, decimals)}` ;
  }
}


