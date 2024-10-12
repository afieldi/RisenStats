import express, { Router } from 'express';
import { CreateDraftRequest, CreateDraftResponse } from '../../../Common/Interface/Internal/drafting';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import { createDraft } from '../business/drafting';

const router: Router = express.Router();

router.post('/create', async(req: TypedRequest<CreateDraftRequest>, res: TypedResponse<CreateDraftResponse>) => {
  const { redTeamName, blueTeamName } = req.body;
  const draft = createDraft(blueTeamName, redTeamName);
  res.json({
    blueAuth: draft.blueTeam.auth,
    redAuth: draft.redTeam.auth,
    room: draft.roomId,
  });
});

export default router;