import PlayerGameModel from "../../models/playergame.model";
import PlayerModel from "../../models/player.model";
import GameModel from "../../models/game.model";

export interface PlayerOverviewResponse {
  overview: PlayerModel
}

export interface PlayerGamesResponse {
  games: PlayerModel[]
}

export interface PlayerDetailedGame {
  playerGame: PlayerGameModel;
  game: GameModel;
}