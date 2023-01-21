import {GameRatingStatGenerator} from "./GameRatingStatGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

import {BaseStatGenerator} from "../BaseStatsGenerator";
import { RoleRatingStatGenerator } from "./RoleRatingStatGenerator";

export class OverallGameRatingStatGenerator extends GameRatingStatGenerator {

    private midGame: GameRatingStatGenerator;
    private lateGame: GameRatingStatGenerator;

    constructor(midGame: RoleRatingStatGenerator, lateGame: RoleRatingStatGenerator) {
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

    getRawStatValue(playerStatsModel: PlayerStatModel): number {
        const wins = 3 * playerStatsModel.win
        const loss = 3 * (playerStatsModel.games - playerStatsModel.win);
        return  ((this.midGame.getRawStatValue(playerStatsModel) * 0.4) + (this.lateGame.getRawStatValue(playerStatsModel) * 0.6))
                + ((wins - loss) / playerStatsModel.games)
    }

}