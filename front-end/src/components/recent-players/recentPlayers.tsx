import { Typography } from '@mui/material';
import React from 'react';
import { PlayerDetailedGame } from '../../../../Common/Interface/Internal/player';
import BaseRisenBox from '../risen-box/base-risen-box';
import BaseTable from '../tables/base-table';
import { roundTo } from '../../../../Common/utils';

interface RecentPlayerProps {
  recentGames: PlayerDetailedGame[];
}

interface TeammateStat {
  games: number;
  wins: number;
}

enum RecentPlayerTableHeaders {
  Player = "Player",
  Games = "Games",
  WL = "W - L",
  WR = 'Win Rate',
}

export default (props: RecentPlayerProps) => {
  const {
    recentGames,
  } = props;

  const teammatesMap: { [key: string]: TeammateStat } = {};

  for (const game of recentGames) {
    const teammates = game.playerGame.teamId === 100 ?
      game.game.playersSummary.redPlayers : game.game.playersSummary.bluePlayers;
    teammates.map(player => {
      if (player.playerName == game.playerGame.player.name)
        return;

      if (!(player.playerName in teammatesMap)) {
        teammatesMap[player.playerName] = {
          games: 0,
          wins: 0,
        };
      }
      teammatesMap[player.playerName].games += 1;
      teammatesMap[player.playerName].wins += ((game.game.winner ? 100 : 200) === game.playerGame.teamId) ? 1 : 0;
    })
  }

  const recentPlayerData: {[key in RecentPlayerTableHeaders]: string}[] = Object.entries(teammatesMap).map(([key, value], index) => ({
    Player: key,
    Games: value.games.toString(),
    "W - L": `${value.wins} - ${value.games - value.wins}`,
    'Win Rate': `${roundTo((value.wins / value.games) * 100, 0)}%`,
  }))

  return (
    <BaseRisenBox title='Recent Teammates'>
      <BaseTable 
        headers={Object.values(RecentPlayerTableHeaders) as RecentPlayerTableHeaders[]} 
        data={recentPlayerData}
      />
    </BaseRisenBox>
  );
}