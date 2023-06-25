import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import PlayerModel from './player.model';
import SeasonModel from "./season.model";
import TeamModel from "./team.model";

@Entity({ name: "player_team_model" })
export default class PlayerTeamModel extends BaseEntity {

    @ManyToOne(() => PlayerModel)
    player: PlayerModel;
    @PrimaryColumn('text')
    playerPuuid: string;

    @ManyToOne(() => SeasonModel)
    teamSeason: SeasonModel;
    @PrimaryColumn("integer")
    teamSeasonId: number;

    @ManyToOne(() => TeamModel)
    team: TeamModel;
    @PrimaryColumn("integer")
    teamTeamId: number;
}