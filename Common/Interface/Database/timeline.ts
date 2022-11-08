export interface TimelineParticipantStats
{
  has15Stats: boolean;
  has25Stats: boolean;

  kills15: number;
  kills25: number;
  killMap: [number, number, number][]; // x, y, time

  deaths15: number;
  deaths25: number;
  deathMap: [number, number, number][]; // x, y, time

  wardsPlaced15: number;
  wardsPlaced25: number;

  wardsKilled15: number;
  wardsKilled25: number;

  assists15: number;
  assists25: number;
  assistMap: [number, number, number][]; // x, y, time

  goldMap: number[]; // one entry per minute
  xpMap: number[];
  csMap: number[];

  killDiff: number;
  killDiff15: number;
  killDiff25: number;

  deathDiff: number;
  deathDiff15: number;
  deathDiff25: number;

  assistDiff: number;
  assistDiff15: number;
  assistDiff25: number;

  goldDiff: number;
  goldDiff15: number;
  goldDiff25: number;

  csDiff: number;
  csDiff15: number;
  csDiff25: number;

  xpDiff: number;
  xpDiff15: number;
  xpDiff25: number;
}