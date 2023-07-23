import PlayerGameModel from "../../models/playergame.model";
import GameModel from "../../models/game.model";

export interface GetGamesResponse {
  games: GameModel[];
}

export interface GetGamesRequest {
  seasonId?: number;
  risenOnly?: boolean;
  pageNumber?: number; // default 0
  pageSize?: number; // default 10
  roleId?: string;
}

export interface GetGamesByDateRequest extends GetGamesRequest {
  startDate: number;
  endDate: number;
}

export interface GetGamesByDateResponse {
  games: GameModel[];
  playerGames: PlayerGameModel[];
}
export interface GetGamesBySeasonIdResponse {
  games: PlayerGameModel[]
}