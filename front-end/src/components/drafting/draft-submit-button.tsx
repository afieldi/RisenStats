import { Button } from '@mui/material';
import React from 'react';
import { Socket } from 'socket.io-client';
import { draftStepConfig } from '../../../../Common/constants';
import { DraftState } from '../../../../Common/Interface/Internal/drafting';

interface Props {
  room: string;
  auth?: string;
  draftState?: DraftState;
  socket: Socket;
  onSubmit: () => void;
}

export default function(props: Props) {
  const { auth, draftState, room, socket, onSubmit } = props;

  let buttonHandler = () => {};
  let buttonDisabled = false;

  const onReady = () => {
    socket.emit('ready', room, auth);
  };

  const onUnready = () => {
    socket.emit('unready', room, auth);
  };

  let side: 'blueTeam' | 'redTeam' | undefined;
  if (draftState?.blueTeam.auth === auth) {
    side = 'blueTeam';
  }
  else if (draftState?.redTeam.auth === auth) {
    side = 'redTeam';
  }

  let text = 'Spectating';

  if (!draftState?.roomActive && side && (draftState?.stage ?? 0) > 0) {
    text = 'Finished';
    buttonDisabled = true;
  }
  // We are at the start and at least one team is not ready
  else if (!draftState?.roomActive && side && draftState?.[side].ready) {
    text = 'Waiting';
    buttonHandler = onUnready;
  }
  else if (draftState?.stage === 0 && side && !draftState[side].ready) {
    text = 'Ready up';
    buttonHandler = onReady;
  }
  else if ((draftState?.stage ?? 0) >= draftStepConfig.length) {
    // There are 20 picks, so if we are after 20 draft is done
    text = 'Finished';
    buttonDisabled = true;
  }
  else if (side && draftState && draftStepConfig[draftState.stage][0] === side) {
    text = 'Lock in';
    buttonHandler = onSubmit;
  }
  else if (side) {
    text = 'Waiting';
    buttonDisabled = false;
  }

  return (
    <Button variant='contained' onClick={buttonHandler} disabled={buttonDisabled}>
      {text}
    </Button>
  );
}