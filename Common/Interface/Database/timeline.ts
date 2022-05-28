export interface TimelineParticipantStats
{
  kills15: number;
  killMap: [number, number, number][]; // x, y, time

  deaths15: number;
  deathMap: [number, number, number][]; // x, y, time

  wardsPlaced15: number;
  wardsKilled15: number;

  assists15: number;
  assistMap: [number, number, number][]; // x, y, time

  goldMap: number[]; // one entry per minute
  xpMap: number[];
  csMap: number[];
}