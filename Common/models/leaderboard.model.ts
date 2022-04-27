import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import PlayerModel from "./player.model";

@Entity({ name: "leaderboard" })
export default class LeaderboardModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  playerPuuid: string;

  @OneToOne(() => PlayerModel)
  player: PlayerModel;

  @Column("smallint")
  maxKills: number;

  @Column("integer")
  totalKills: number;

  @Column("real")
  avgKills: number;

  @Column("smallint")
  maxDeaths: number;

  @Column("integer")
  totalDeaths: number;

  @Column("real")
  avgDeaths: number;

  @Column("smallint")
  maxAssists: number;

  @Column("integer")
  totalAssists: number;

  @Column("real")
  avgAssists: number;

  @Column("real")
  avgDpm: number;

  @Column("real")
  avgGpm: number;

  @Column("real")
  avgDamagePerGold: number;

  @Column("smallint")
  games: number;

  @Column("bigint")
  updatedAt: number;
}