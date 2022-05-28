import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "player" })
export default class PlayerModel extends BaseEntity
{
  @PrimaryColumn("varchar")
  puuid: string;

  @Column("varchar")
  summonerId: string;

  @Column("varchar")
  name: string;

  @Column("int")
  summonerLevel: number;

  @Column("varchar")
  searchName: string;

  @Column("varchar", {nullable: true})
  notes: string;

  @Column("bigint")
  refreshedAt: number;

  @Column("varchar", {nullable: true})
  league: string;

  @Column("varchar", {nullable: true})
  division: string;

  @Column("smallint")
  profileIconId: number;
}
