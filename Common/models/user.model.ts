import {BaseEntity, Column, Entity, PrimaryColumn, Unique} from "typeorm";
@Entity({ name: "user_model" })
@Unique(["id"])
export default class UserModel extends BaseEntity {

    @PrimaryColumn("varchar")
    id: number;

    @Column("varchar")
    name: number;
}