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

  @Column("varchar")
  searchName: string;

  @Column("varchar")
  notes: string;

  @Column("bigint")
  refresedAt: number;

  @Column("varchar")
  league: string;

  @Column("varchar")
  division: string;

  @Column("smallint")
  profileIconId: number;
}
