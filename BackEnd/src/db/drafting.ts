import { DraftState } from '../../../Common/Interface/Internal/drafting';
import DraftsModel from '../../../Common/models/drafts.model';
import { ensureConnection } from './dbConnect';

export async function createDbDraft(draftState: DraftState) {
  await ensureConnection();
  return await DraftsModel.save({
    blueTeam: draftState.blueTeam,
    redTeam: draftState.redTeam,
    roomId: draftState.roomId,
  });
}

export async function getDbDraft(roomId: string): Promise<DraftsModel> {
  await ensureConnection();
  return await DraftsModel.findOne({ where: { roomId: roomId } });
}