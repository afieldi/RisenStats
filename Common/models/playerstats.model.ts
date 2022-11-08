import { GameRoles } from "../Interface/General/gameEnums";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import PlayerModel from "./player.model";
import SeasonModel from "./season.model";


@Entity({ name: "player_game" })
export default class PlayerGameModel extends BaseEntity {
  @PrimaryColumn('text')
  playerPuuid: string;

  @ManyToOne(() => PlayerModel, { eager: true })
  player: PlayerModel;

  @PrimaryColumn('integer')
  seasonId: number;

  @ManyToOne(() => SeasonModel)
  season: SeasonModel;

  @PrimaryColumn('text')
  role: GameRoles;
}