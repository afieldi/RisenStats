import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { TeamDraftState } from '../Interface/Internal/drafting';

@Entity({ name: "drafts" })
export default class DraftsModel extends BaseEntity
{
  @PrimaryColumn('text')
  roomId: string;

  @Column('jsonb')
  blueTeam: TeamDraftState;

  @Column('jsonb')
  redTeam: TeamDraftState;
}