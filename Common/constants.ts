export const GAMES_MAX_PAGE_SIZE = 10;
export const SUMMONERS_RIFT_HEIGHT = 15000;
export const SUMMONERS_RIFT_WIDTH = 15000;
export const MAX_MATCH_HISTORY_GAMES = 100;
export const DRAWER_WIDTH = 230;
export const DEFAULT_RISEN_SEASON_ID = 'RISEN';

export const BLUE_TEAM_ID = 100;
export const RED_TEAM_ID = 200;

export const DRAFT_SOCKET_PATH = '/drafting-tool';

export const draftStepConfig: ['redTeam' | 'blueTeam', 'picks' | 'bans', number][] = [
  ['blueTeam', 'bans', 0],
  ['redTeam', 'bans', 0],
  ['blueTeam', 'bans', 1],
  ['redTeam', 'bans', 1],
  ['blueTeam', 'bans', 2],
  ['redTeam', 'bans', 2],
  ['blueTeam', 'picks', 0],
  ['redTeam', 'picks', 0],
  ['redTeam', 'picks', 1],
  ['blueTeam', 'picks', 1],
  ['blueTeam', 'picks', 2],
  ['redTeam', 'picks', 2],
  ['redTeam', 'bans', 3],
  ['blueTeam', 'bans', 3 ],
  ['redTeam', 'bans', 4],
  ['blueTeam', 'bans', 4],
  ['redTeam', 'picks', 3],
  ['blueTeam', 'picks', 3],
  ['blueTeam', 'picks', 4],
  ['redTeam', 'picks', 4],
];
