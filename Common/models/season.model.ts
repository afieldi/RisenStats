import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ProviderModel from "./provider.model";

@Entity({ name: "season" })
export default class SeasonModel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  seasonName: string;

  @Column("varchar")
  searchname: string;

  @Column("boolean")
  active: boolean;

  @Column('integer', {nullable: true})
  providerProviderId: number;

  @ManyToOne(() => ProviderModel)
  provider: ProviderModel

  @Column("integer")
  tourneyId: number;

  @Column('varchar', {nullable: true})
  googleSheetId: string;

  @Column('varchar', {nullable: true})
  googleSheetParserType: string;
}