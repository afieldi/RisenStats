import {BaseEntity, Entity, PrimaryColumn} from "typeorm";

@Entity({ name: "denylist" })
export default class DenylistModel extends BaseEntity
{
    @PrimaryColumn('text')
    playerPuuid: string;
}