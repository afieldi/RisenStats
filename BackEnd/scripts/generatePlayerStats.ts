import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from "../src/external-api/game";
import { ToMatchId } from "../../Common/utils";
import { GetDbPlayerGamesByGameId } from "../src/db/games";
import { ProcessTimeline } from "../src/business/timeline";
import GameModel from "../../Common/models/game.model";
import {CreatePlayerStatsByPuuid} from "../src/business/playerstats";

// backfill the player_stat_model table so that anyone who has played tourney games has stats.
// We need to do this so we have data for leaderboards.
async function generatePlayerStats(): Promise<any> {
    await ensureConnection();

    let games: GameModel[] = await GameModel.find();
    let playersUpdated: Set<string> = new Set<string>();

    for (let game of games) {
        for (let player of game.players) {
            const puuid = player.playerPuuid;

            if(playersUpdated.has(puuid)) {
                continue;
            }

            playersUpdated.add(puuid);
            await CreatePlayerStatsByPuuid(player.playerPuuid)

        }
    }
}

generatePlayerStats();