import { GameRoles } from "../Interface/General/gameEnums";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import PlayerModel from "./player.model";
import SeasonModel from "./season.model";

@Entity({name: "playerchampionstats"})
export default class PlayerChampionStatsModel extends BaseEntity
{
  @PrimaryColumn('integer')
  championId: number;

  @PrimaryColumn('varchar')
  playerPuuid: string;

  @ManyToOne(() => PlayerModel)
  player: PlayerModel;

  @PrimaryColumn('text')
  position: string;

  @PrimaryColumn('integer')
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