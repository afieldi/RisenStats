import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import PlayerGameModel from "./playergame.model";
import SeasonModel from "./season.model";

@Entity({ name: "game" })
export default class GameModel extends BaseEntity
{
  @PrimaryColumn("bigint")
  gameId: number;

  @Column("boolean")
  winner: boolean; // true is blue win, false is red win

  @Column('integer', {nullable: true})
  seasonId: number;

  @ManyToOne(() => SeasonModel)
  season: SeasonModel;

  @Column("smallint")
  gameType: number;

  @Column("bigint")
  gameStart: number;

  @Column("varchar")
  patch: string;

  @Column("smallint")
  gameDuration: number;

  @OneToMany(() => PlayerGameModel, playerModel => playerModel.game)
  players: PlayerGameModel[];

  @Column("boolean")
  tournamentGame: boolean;

}