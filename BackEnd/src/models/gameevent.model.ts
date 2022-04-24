import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GameModel from "./game.model";
import PlayerModel from "./player.model";

@Entity({ name: "game_event" })
export default class GameEventModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', {nullable: true})
  gameGameId: number;

  @ManyToOne(() => GameModel)
  game: GameModel;

  @Column('text', {nullable: true})
  primaryId: string;

  @ManyToOne(() => PlayerModel)
  primary: PlayerModel;

  @Column("smallint")
  x: number;

  @Column("smallint")
  y: number;

  @Column("int")
  timestamp: number;

  @Column("varchar")
  eventData: string;

  @Column("varchar")
  eventSubData: string;
}