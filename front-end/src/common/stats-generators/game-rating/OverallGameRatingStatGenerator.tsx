import {GameRatingStatGenerator} from "./GameRatingStatGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

import {BaseStatGenerator} from "../BaseStatsGenerator";

export class OverallGameRatingStatGenerator extends BaseStatGenerator {

    private midGame: GameRatingStatGenerator;
    private lateGame: GameRatingStatGenerator;

    constructor(midGame: GameRatingStatGenerator, lateGame: GameRatingStatGenerator) {
        super();
        this.midGame = midGame;
        this.lateGame = lateGame;
    }

    getStatTitle(): string {
        return "Overall Game Rating"
    }

    getToolTip(): string {
        return "Factors in your early + late game rating + how much you win overall";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        const wins = 3 * playerStatsModel.win
        const loss = 3 * (playerStatsModel.games - playerStatsModel.win);
        return  ((this.midGame.getStatValue(playerStatsModel) * 0.4) + (this.lateGame.getStatValue(playerStatsModel) * 0.6))
                + ((wins - loss) / playerStatsModel.games)
    }

}