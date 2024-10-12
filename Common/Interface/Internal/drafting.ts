export interface TeamDraftState {
  bans: string[];
  picks: string[];
  displayName: string;
  disabledPicks: string[];
  ready: boolean;
  auth: string;
  teamId?: number; // Potential update for risen teams
}

export interface DraftState {
  redTeam: TeamDraftState;
  blueTeam: TeamDraftState;
  stage: number;
  roomId: string;
  timerMax: number;
  timerRemaining: number;
  roomActive: boolean;
}

export interface CreateDraftRequest {
  blueTeamName: string;
  redTeamName: string;
}

export interface CreateDraftResponse {
  redAuth: string;
  blueAuth: string;
  room: string;
}

// Socket Io events
export interface DraftingSocketServerToClient {
  draftUpdate: (newState: DraftState) => void;
}

export interface DraftingSocketClientToServer {
  register: (room: string) => void;
  pick: (room: string, auth: string, stage: number) => void;
  hover: (room: string, auth: string, pick: string, stage: number) => void;
  ready: (room: string, auth: string) => void;
  unready: (room: string, auth: string) => void;
}