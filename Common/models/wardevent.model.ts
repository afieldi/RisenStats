import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import GameModel from "./game.model";
import ProviderModel from "./provider.model";

@Entity({ name: "ward_event" })
export default class WardEvent extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("bigint")
  gameGameId: number;

  @ManyToOne(() => GameModel)
  @JoinColumn({name: 'gameGameId', referencedColumnName: 'gameId'})
  game: GameModel;

  @Column("smallint")
  playerId: number;

  @Column("varchar")
  wardType: string;
}