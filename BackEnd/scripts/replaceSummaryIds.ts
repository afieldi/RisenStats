import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { GetRiotPlayerBySummonerId } from "../src/external-api/player";
import GameModel from "../../Common/models/game.model";
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';

const BATCH_SIZE = 200;

async function UpdateSummary() {
    await ensureConnection();
    const gameRes = await GameModel.find();

    const playerStore: { [key: string]: string } = {};

    let gameObjs: GameModel[] = [];

    for (const game of gameRes) {
        console.log('handling game: ', game.gameId);
        for (const i in game.playersSummary.bluePlayers) {
            const id = game.playersSummary.bluePlayers[i].playerPuuid;
            if (id === 'BOT')
                continue;
            if (id.length === 78) {
                continue;
            }
            if (id in playerStore) {
                game.playersSummary.bluePlayers[i].playerPuuid = playerStore[id];
            }
            else {
                game.playersSummary.bluePlayers[i].playerPuuid = (await GetRiotPlayerBySummonerId(id)).puuid;
                playerStore[id] = game.playersSummary.bluePlayers[i].playerPuuid;
            }
        }
        gameObjs.push(game);
        if (gameObjs.length >= BATCH_SIZE) {
            console.log('saving batch');
            await SaveObjects(gameObjs);
            gameObjs = [];
        }
    }
}

UpdateSummary();