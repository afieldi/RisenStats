import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import PlayerModel from './player.model';

@Entity({ name: "player_team_model" })
export default class PlayerTeamModel extends BaseEntity {

    @ManyToOne(() => PlayerModel)
    player: PlayerModel;
    @PrimaryColumn('text')
    playerPuuid: string;
    @PrimaryColumn("integer")
    seasonId: number
    @PrimaryColumn("integer")
    teamId: number
}