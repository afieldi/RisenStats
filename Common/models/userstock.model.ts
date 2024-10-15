import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import SeasonModel from "./season.model";
import TeamModel from "./team.model";
import Usermodel from "./user.model";

@Entity({ name: "user_stock" })
export default class UserStockModel extends BaseEntity {

    @ManyToOne(() => Usermodel)
    user: Usermodel;
    @PrimaryColumn("varchar")
    userId: number;

    @ManyToOne(() => SeasonModel)
    teamSeason: SeasonModel;
    @Column("integer")
    teamSeasonId: number;

    @ManyToOne(() => TeamModel)
    team: TeamModel;
    @Column("integer")
    teamTeamId: number;

    @Column("integer")
    amount_held: number
}