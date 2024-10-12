import { CreateDraftRequest, CreateDraftResponse } from '../../../Common/Interface/Internal/drafting';
import { MakeBackendCall } from './_call';

export async function CreateDraft(requestData: CreateDraftRequest) {
  return await MakeBackendCall<CreateDraftRequest>('/api/drafting/create', 'POST', requestData) as CreateDraftResponse;
}