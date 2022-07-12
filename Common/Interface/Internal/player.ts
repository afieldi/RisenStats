import PlayerGameModel from "../../models/playergame.model";
import PlayerModel from "../../models/player.model";
import GameModel from "../../models/game.model";
import PlayerChampionStatsModel from "models/playerchampionstats.model";

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

export interface UpdatePlayerGamesResponse {
  updatedGames: GameModel[];
  failedUpdateGameIds: string[];
}

export interface PlayerChampionStatsResponse {
  champions: PlayerChampionStatsModel[];
}