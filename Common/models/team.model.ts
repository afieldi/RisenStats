import {BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: "team_model" })
export default class TeamModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId: number
    @Index()
    @PrimaryColumn("integer")
    seasonId: number
    @Column("text")
    displayName: string
    @Column("integer")
    win: number
    @Column("integer")
    loss: number
    @Column("text")
    abbreviation: string
    @Column("text")
    opgg: string
    @Column("boolean")
    wonSeason: boolean

}
