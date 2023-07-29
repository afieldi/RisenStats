import SeasonModel from "../../models/season.model";

export interface GetSeasonsResponse {
  seasons: SeasonModel[];
}

export interface CreateSeasonRequest {
  seasonName: string;
  providerId: number;
}

export interface GetSeasonResponse {
  season: SeasonModel;
}

export interface GetSeasonResponse {
  season: SeasonModel;
}

export interface GetSeasonRequest {
  searchName: string;
}