import { GameRoles } from "../Interface/General/gameEnums";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import PlayerModel from "./player.model";
import SeasonModel from "./season.model";

@Entity({name: "playerchampionstats"})
export default class PlayerChampionStatsModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('integer')
  championId: number;

  @Index()
  @Column('varchar')
  playerPuuid: string;

  @ManyToOne(() => PlayerModel)
  player: PlayerModel;

  @Index()
  @Column('text', {nullable: true})
  position: string;

  @Column('integer', {nullable: true})
  seasonId: number;

  @ManyToOne(() => SeasonModel)
  season: SeasonModel;

  @Column('smallint')
  totalGames: number;

  @Column('smallint')
  totalWins: number;

  @Column('integer')
  totalKills: number;

  @Column('integer')
  totalDeaths: number;

  @Column('integer')
  totalAssists: number;

  @Column('integer')
  totalMinionsKilled: number;

  @Column('integer')
  totalNeutralMinionsKilled: number;

  @Column('integer')
  averageDamageDealt: number;

  @Column('integer')
  averageDamageTaken: number;

  @Column('smallint')
  totalDoubleKills: number;

  @Column('smallint')
  totalTripleKills: number;

  @Column('smallint')
  totalQuadraKills: number;

  @Column('smallint')
  totalPentaKills: number;

  @Column('integer')
  averageGameDuration: number;

  @Column('integer', {nullable: true})
  averageGoldEarned: number;
}