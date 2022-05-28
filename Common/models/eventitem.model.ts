import { ItemEventType } from '../Interface/Database/events';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PlayerModel from './player.model';
import GameModel from './game.model';

@Entity({ name: "itemevent" })
export default class CodeModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("bigint")
  gameGameId: number;

  @ManyToOne(() => GameModel)
  game: GameModel;

  @Column("smallint")
  itemId: string;

  @Column("varchar", {nullable: true})
  playerPuuid: number;

  @ManyToOne(() => PlayerModel)
  player: PlayerModel;

  @Column('smallint')
  eventType: ItemEventType;
}