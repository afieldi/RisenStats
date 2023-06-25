import {BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import SeasonModel from "./season.model";

@Entity({ name: "team_model" })
export default class TeamModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId: number
    @ManyToOne(() => SeasonModel)
    season: SeasonModel;
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
    @Column("boolean")
    wonSeason: boolean
}
