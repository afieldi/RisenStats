import {BaseEntity, Column, Entity, ManyToOne, Unique} from "typeorm";
import SeasonModel from "./season.model";
import TeamModel from "./team.model";

@Entity({ name: "stock_timeline" })
@Unique(["teamSeasonId"])
export default class StockTimelineModel extends BaseEntity {

    @ManyToOne(() => SeasonModel)
    teamSeason: SeasonModel;
    @Column("integer")
    teamSeasonId: number;

    @ManyToOne(() => TeamModel)
    team: TeamModel;
    @Column("integer")
    teamTeamId: number;

    @Column("integer")
    dollar_value: number;

    @Column("integer")
    timestamp: number;
}