import PlayerGameModel from "../../models/playergame.model";
import PlayerModel from "../../models/player.model";
import GameModel from "../../models/game.model";
import PlayerChampionStatsModel from "../../models/playerchampionstats.model";
import { GameRoles } from "../General/gameEnums";

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

export interface PlayerChampionStatsResponse {
  champions: PlayerChampionStatsModel[];
}

export interface PlayerChampionStatsRequest {
  seasonId?: number;
  risenOnly?: boolean;
  roleId?: GameRoles;
}