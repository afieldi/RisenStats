import PlayerGameModel from "../../models/playergame.model";
import PlayerModel from "../../models/player.model";
import GameModel from "../../models/game.model";

export interface PlayerOverviewRequest {
  name: string,
  tagline: string
}
export interface PlayerOverviewResponse {
  overview: PlayerModel
}

export interface PlayerGamesResponse {
  games: PlayerDetailedGame[]
}

export interface PlayerDetailedGame {
  playerGame: PlayerGameModel;
  game: GameModel;
}

export interface UpdatePlayerGamesResponse {
  updatedGames: GameModel[];
  failedUpdateGameIds: string[];
}

export interface PlayerSeasonsResponse {
  seasons: number[];
}