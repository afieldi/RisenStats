import TeamModel from "../../models/team.model";

export interface GetTeamsRequest {
    seasonId: number
}

export interface GetTeamsResponse {
    teams: TeamModel[]
}