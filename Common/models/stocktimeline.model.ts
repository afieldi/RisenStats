import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";
import SeasonModel from "./season.model";
import TeamModel from "./team.model";

@Entity({ name: "stock_timeline" })
export default class StockTimelineModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    transactionId: number;

    @ManyToOne(() => SeasonModel)
    teamSeason: SeasonModel;
    @Column("integer")
    teamSeasonId: number;

    @ManyToOne(() => TeamModel)
    team: TeamModel;
    @Column("integer")
    teamTeamId: number;

    @Column("integer")
    dollarValue: number;

    @Column("timestamptz")
    timestamp: Date;
}