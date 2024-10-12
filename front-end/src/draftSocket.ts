import { io, Socket } from 'socket.io-client';
import { DRAFT_SOCKET_PATH } from '../../Common/constants';
import { DraftingSocketClientToServer, DraftingSocketServerToClient } from '../../Common/Interface/Internal/drafting';

const socket: Socket<
  DraftingSocketServerToClient,
  DraftingSocketClientToServer
> = io(process.env.REACT_APP_BACKEND_URL, {
  path: DRAFT_SOCKET_PATH,
});

export default socket;
