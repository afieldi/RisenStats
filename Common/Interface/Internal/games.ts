import GameModel from "../../models/game.model";
import PlayerGameModel from "../../models/playergame.model";

export interface GetGamesResponse {
  games: GameModel[]
}

export interface GetGamesRequest {
  seasonId?: number;
  risenOnly?: boolean;
  pageNumber?: number; // default 0
  pageSize?: number; // default 10
  roleId?: string;
}
export interface GetGamesBySeasonIdResponse {
  games: PlayerGameModel[]
}