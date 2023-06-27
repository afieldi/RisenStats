import { BaseStatGenerator } from '../BaseStatsGenerator';
import { GameRoles } from '../../../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { sigmoid } from '../../../../../Common/utils';
import { Rank } from '../../types';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export abstract class GameRatingStatGenerator extends BaseStatGenerator {

  normalizeStatValue(statValue: number): number {
    /*
            We are using the sigmoid function for this. I'm using 110 as a soft max (95% of max score),
            and 30 as a minimum score (5% of max score).

            The mid point between these numbers is (120 + 30) / 2 = 75, so we take the raw
            value and subtract 70.

            After messing around in desmos, a k value of 13 has -40 and 40 as ~95%/5% activation.
            This means that if someone gets 110, they will have gotten 95% of our maximum score.

            Then I set the floor to be 30 and ceiling to be 100. I don't want anyone to feel too bad
        */

    const midPoint = 70;
    const midStat = statValue - midPoint;
    return (sigmoid(midStat, 16) * 70) + 30;
  }

  getRatingFromNumber(rating: number): Rank {
    if(rating > 95) {
      return Rank.SPLUS;
    }
    else if(rating > 90) {
      return Rank.S;
    }
    else if(rating > 75) {
      return Rank.A;
    }
    else if(rating > 55) {
      return Rank.B;
    }
    else if(rating > 40) {
      return Rank.C;
    }
    return Rank.D;
  }

  getRating(playerStatsModel: AggregatedPlayerStatModel[]): Rank {
    const rating = this.getStatNumber(playerStatsModel);
    return this.getRatingFromNumber(rating);
  }

    abstract getRawStatValue(playerStatsModel: AggregatedPlayerStatModel): number;

    getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
      const rating = this.getRawStatValue(playerStatsModel);
      return this.normalizeStatValue(rating);
    }
}