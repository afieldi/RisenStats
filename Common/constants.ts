export const GAMES_MAX_PAGE_SIZE = 10;
export const SUMMONERS_RIFT_HEIGHT = 15000;
export const SUMMONERS_RIFT_WIDTH = 15000;
export const MAX_MATCH_HISTORY_GAMES = 100;
export const DRAWER_WIDTH = 230;
export const DEFAULT_RISEN_SEASON_ID = 'RISEN';

export const BLUE_TEAM_ID = 100;
export const RED_TEAM_ID = 200;

export const DRAFT_SOCKET_PATH = '/drafting-tool';

export enum DRAFT_TEAM {
  blueTeam = 'blueTeam',
  redTeam = 'redTeam',
}

export enum DRAFT_STAGE {
  picks = 'picks',
  bans = 'bans',
}

export const draftStepConfig: [DRAFT_TEAM, DRAFT_STAGE, number][] = [
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.bans, 0],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.bans, 0],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.bans, 1],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.bans, 1],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.bans, 2],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.bans, 2],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.picks, 0],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.picks, 0],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.picks, 1],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.picks, 1],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.picks, 2],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.picks, 2],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.bans, 3],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.bans, 3 ],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.bans, 4],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.bans, 4],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.picks, 3],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.picks, 3],
  [DRAFT_TEAM.blueTeam, DRAFT_STAGE.picks, 4],
  [DRAFT_TEAM.redTeam, DRAFT_STAGE.picks, 4],
];

