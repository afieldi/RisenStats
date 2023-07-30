import dotenv from 'dotenv';
dotenv.config({ path: './.env.development' });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import GameModel from '../../Common/models/game.model';
import PlayerGameModel from '../../Common/models/playergame.model';
import { SaveDataByMatchId } from '../src/business/games';
import { ToMatchId } from '../../Common/utils';
import { ApiError } from '../src/external-api/_call';

async function doBackfill() {
  await ensureConnection();
  const allGames = await GameModel.find();
  for (const game of allGames) {
    if (game.gameId == 4382455305) {
      continue;
    }
    let players = await PlayerGameModel.find({ where: { gameGameId: game.gameId } });
    const playerMap: { [key: string]: PlayerGameModel } = {};
    for (const player of players) {
      playerMap[player.playerPuuid] = player;
      playerMap[player.player.summonerId] = player;
    }
    console.log(`Found ${players.length} players for game ${game.gameId}`);
    if (players.length === 0) {
      console.log('No players found... updating game');
      try {
        await SaveDataByMatchId(ToMatchId(game.gameId));
      } catch (error) {
        if (error instanceof ApiError) {
          if ((error as ApiError).status === 404) {
            continue;
          }
        }
        throw error;
      }
      players = await PlayerGameModel.find({ where: { gameGameId: game.gameId } });

      for (const player of players) {
        playerMap[player.playerPuuid] = player;
        playerMap[player.player.summonerId] = player;
      }
    }
    for (let i = 0; i < game.playersSummary.redPlayers.length; i ++) {
      game.playersSummary.redPlayers[i].kills = playerMap[game.playersSummary.redPlayers[i].playerPuuid].kills;
      game.playersSummary.redPlayers[i].deaths = playerMap[game.playersSummary.redPlayers[i].playerPuuid].deaths;
      game.playersSummary.redPlayers[i].assists = playerMap[game.playersSummary.redPlayers[i].playerPuuid].assists;
      game.playersSummary.redPlayers[i].playerPuuid = playerMap[game.playersSummary.redPlayers[i].playerPuuid].playerPuuid;
    }

    for (let i = 0; i < game.playersSummary.bluePlayers.length; i ++) {
      game.playersSummary.bluePlayers[i].kills = playerMap[game.playersSummary.bluePlayers[i].playerPuuid].kills;
      game.playersSummary.bluePlayers[i].deaths = playerMap[game.playersSummary.bluePlayers[i].playerPuuid].deaths;
      game.playersSummary.bluePlayers[i].assists = playerMap[game.playersSummary.bluePlayers[i].playerPuuid].assists;
      game.playersSummary.bluePlayers[i].playerPuuid = playerMap[game.playersSummary.bluePlayers[i].playerPuuid].playerPuuid;

    }
    game.save();
  }
}

doBackfill();