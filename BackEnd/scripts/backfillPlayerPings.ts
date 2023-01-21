import dotenv from "dotenv";
dotenv.config({ path: "./.env.development" });
import {ensureConnection, SaveObjects} from "../src/db/dbConnect";
import PlayerGameModel from "../../Common/models/playergame.model";
import PlayerStatModel from "../../Common/models/playerstat.model";

async function backfillPlayerGamePings(): Promise<any> {
    await ensureConnection();
    let res = await PlayerGameModel.find({ where: {} })
    console.log(res.length)
    let i = 0;
    for (let item of res) {
        i++;
        item.pushPings = 0;
        item.allInPings = 0;
        item.assistMePings = 0;
        item.baitPings = 0;
        item.basicPings = 0;
        item.enemyMissingPings = 0;
        item.enemyVisionPings = 0;
        item.getBackPings = 0;
        item.holdPings = 0;
        item.needVisionPings = 0;
        item.onMyWayPings = 0;
        item.pushPings = 0;
        item.visionClearedPings = 0;
        item.dangerPings = 0
        item.commandPings = 0
        console.log(`Saving item ${i}`)
        await SaveObjects([item])
    }
    console.log("DONE!")
}

async function backfillPlayerGamePingsForStats(): Promise<any> {
    await ensureConnection();
    let res = await PlayerStatModel.find({ where: {} })
    console.log(res.length)
    let i = 0;

    for (let item of res) {
        i++;
        item.pushPings = 0;
        item.allInPings = 0;
        item.assistMePings = 0;
        item.baitPings = 0;
        item.basicPings = 0;
        item.enemyMissingPings = 0;
        item.enemyVisionPings = 0;
        item.getBackPings = 0;
        item.holdPings = 0;
        item.needVisionPings = 0;
        item.onMyWayPings = 0;
        item.pushPings = 0;
        item.visionClearedPings = 0;
        item.dangerPings = 0
        item.commandPings = 0
        console.log(`Saving item ${i}`)
        await SaveObjects([item])
    }
    console.log("DONE!")

}

// backfillPlayerGamePings();
backfillPlayerGamePingsForStats()