import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import SeasonModel from './season.model';

@Entity({ name: "code" })
export default class CodeModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  code: string;

  @Column("integer", {nullable: true})
  seasonId: number;

  @ManyToOne(() => SeasonModel)
  season: SeasonModel;
}