export interface GameSummaryPlayers {
  redPlayers: GameSummaryPlayer[];
  bluePlayers: GameSummaryPlayer[];
}

export interface GameSummaryPlayer {
  playerName: string;
  playerPuuid: string;
  championId: number;
  position: string;
  team: number;
  summoner1Id: number;
  summoner2Id: number,
  totalDamage: number,
  totalGold: number;
  totalCS: number;
  totalVision: number;
}

export interface TeamSumStat
{
  totalGold: number;
  totalVision: number;
  totalCS: number;
  totalDamage: number;
}

export interface TeamSumStats
{
  redStats: TeamSumStat;
  blueStats: TeamSumStat;
}