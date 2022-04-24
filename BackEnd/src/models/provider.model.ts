import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "provider" })
export default class ProviderModel extends BaseEntity
{
  @PrimaryColumn("smallint")
  providerId: number;

  @Column("varchar")
  callback: string;
}