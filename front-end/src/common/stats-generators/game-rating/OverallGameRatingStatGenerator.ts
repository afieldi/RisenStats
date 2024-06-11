import { GameRatingStatGenerator } from './GameRatingStatGenerator';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';

import { BaseStatGenerator } from '../BaseStatsGenerator';
import { RoleRatingStatGenerator } from './RoleRatingStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class OverallGameRatingStatGenerator extends GameRatingStatGenerator {

  private earlyGame: GameRatingStatGenerator;
  private lateGame: GameRatingStatGenerator;

  constructor(midGame: RoleRatingStatGenerator, lateGame: RoleRatingStatGenerator) {
    super();
    this.earlyGame = midGame;
    this.lateGame = lateGame;
  }

  getStatTitle(): string {
    return 'Overall Game Rating';
  }

  getToolTip(): string {
    return 'Factors in your early + late game rating + how much you win overall';
  }

  getRawStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    const wins = playerStatsModel.win;
    const earlyGameValue = this.earlyGame.getRawStatValue(playerStatsModel) * 0.4;
    const lateGameValue = this.lateGame.getRawStatValue(playerStatsModel) * 0.6;
    const winrate = (wins / playerStatsModel.games);
    const scoreMultiplier = 0.9 + (winrate * 0.1); // multiply their score based on their winrate, this number can be between 0.9 and 1
    return  (earlyGameValue + lateGameValue) * scoreMultiplier;
  }

}