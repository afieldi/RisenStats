import { ItemEventType, ObjectiveEventType } from '../Interface/Database/events';
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

  @Column("varchar", {nullable: true})
  playerPuuid: number;

  @ManyToOne(() => PlayerModel)
  player: PlayerModel;

  @Column('smallint')
  eventType: ObjectiveEventType;

  @Column('smallint')
  x: number;

  @Column('smallint')
  y: number;

  @Column('smallint')
  teamId: number;
}