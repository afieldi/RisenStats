export interface GameSummaryPlayers {
  redPlayers: GameSummaryPlayer[];
  bluePlayers: GameSummaryPlayer[];
}

export interface GameSummaryPlayer {
  playerName: string;
  playerPuuid: string;
  champion: number;
  position: string;
  team: number;
}