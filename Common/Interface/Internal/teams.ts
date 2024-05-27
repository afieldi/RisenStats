import TeamModel from "../../models/team.model";

export interface GetTeamsRequest {
    seasonId: number
}

export interface GetTeamsResponse {
    teams: TeamModel[]
}

export interface GetTeamByAbbreviationRequest {
    seasonId: number
}

export interface GetTeamAbbreviationResponse {
    team: TeamModel
}