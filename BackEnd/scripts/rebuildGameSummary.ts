import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { CreatePlayerSummary, GetGameDataByMatchId, SaveDataByMatchId } from '../src/business/games';
import GameModel from '../../Common/models/game.model';
import { ensureConnection } from '../src/db/dbConnect';
import { DOMINATE, DRAFT, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';


async function rebuildGameSummary(seasonId: number) {
  // let matchId = 'NA1_4955539419';
  await ensureConnection();

  let games = await GameModel.find({ where: { seasonId: seasonId } });
  // let games = await GameModel.find({ where: { gameId: 4955539419 } });

  let i = 0;
  for (let game of games) {
    console.log(`${i}/${games.length}`);
    await rebuildPlayerSummary(game);
    i++;
  }


}

async function rebuildPlayerSummary(game: GameModel) {
  await ensureConnection();
  const gameData = await GetGameDataByMatchId(`NA1_${game.gameId}`);
  game.playersSummary =  CreatePlayerSummary(gameData);
  let savedGame = await game.save();
  console.log(savedGame);
}


rebuildGameSummary(DRAFT);
