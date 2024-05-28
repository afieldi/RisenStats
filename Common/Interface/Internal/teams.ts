import TeamModel from "../../models/team.model";
import PlayerTeamModel from "../../models/playerteam.model";

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

export interface GetTeamRosterRequest {
    seasonId: number
}

export interface GetTeamRosterResponse {
    roster: PlayerTeamModel[]
}