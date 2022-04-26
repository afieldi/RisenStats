import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GameModel from "./game.model";

@Entity({ name: "ban" })
export default class BanModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("boolean")
  blueTeam: boolean;

  @Column("smallint")
  championId: number;

  @Column("bigint")
  gameGameId: number;

  @ManyToOne(() => GameModel)
  game: GameModel;

  @Column("smallint")
  banNumber: number;

  @Column("boolean")
  firstPhase: boolean;
}