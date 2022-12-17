import PlayerStatModel from "../../../../../Common/models/playerstat.model";
import {GameRatingStatGenerator} from "./GameRatingStatGenerator";
import {riotTimestampToMinutes} from "../../../../../Common/utils";

export class LateGameRatingStatGenerator extends GameRatingStatGenerator {

    getStatTitle(): string {
        return "Late Game Rating"
    }

    getToolTip(): string {
        return "Rates you based on your lategame stats";
    }

    getSoloLaneStatValue(playerStatsModel: PlayerStatModel): number {
        const kda = 2.5 * (playerStatsModel.kda / playerStatsModel.games)
        const cspm = 3.5 * ((playerStatsModel.totalMinionsKilled + playerStatsModel.enemyJungleMonsterKills + playerStatsModel.alliedJungleMonsterKills) /  riotTimestampToMinutes(playerStatsModel.gameLength) - 5)
        const dpg = 20 * ((playerStatsModel.totalDamageDealtToChampions / playerStatsModel.goldEarned) / playerStatsModel.games)
        const wardsPlaced = 0.5 * (playerStatsModel.wardsPlaced / playerStatsModel.games)
        const wardsKilled = 2 * (playerStatsModel.wardsKilled / playerStatsModel.games)
        const objDMG = 0.001 * (playerStatsModel.damageDealtToObjectives / playerStatsModel.games)
        const turretTakedowns = 3 * (playerStatsModel.turretTakedowns / playerStatsModel.games)
        const csDiff = 0.3 * (playerStatsModel.csDiff / playerStatsModel.games)
        const xpDiff = 0.01 * (playerStatsModel.xpDiff / playerStatsModel.games)

        const dpm = 0.025 *  (playerStatsModel.totalDamageDealtToChampions / riotTimestampToMinutes(playerStatsModel.gameLength))
        const dmgTankedPM = 0.03 * (playerStatsModel.totalDamageTaken / riotTimestampToMinutes(playerStatsModel.gameLength))
        const carryStat = this.calculateCarryStat(dpm, dmgTankedPM)

        // console.log(playerStatsModel.player.name)
        // console.log(`kda ${kda}`)
        // console.log(`cspm ${cspm}`)
        // console.log(`dpg ${dpg} `)
        // console.log(`dpm ${dpm}`)
        // console.log(`tanked ${dmgTankedPM}`)
        // console.log(`carry ${carryStat}`)
        // console.log(`wp ${wardsPlaced}`)
        // console.log(`wk ${wardsKilled}`)
        // console.log(`obj ${objDMG}`)
        // console.log(`tt ${turretTakedowns}`)
        // console.log(`csd ${csDiff}`)
        // console.log(`xpd ${xpDiff}`)

        return (kda + cspm + dpg + carryStat + wardsKilled + wardsPlaced + objDMG + turretTakedowns + csDiff + xpDiff);
    }

    getSupportStatValue(playerStatsModel: PlayerStatModel): number {
        const kills = 2.5 * (playerStatsModel.kills / playerStatsModel.games);
        const assists = 1.5 * (playerStatsModel.assists / playerStatsModel.games);
        const deaths = -2 * (playerStatsModel.deaths / playerStatsModel.games); // Dieing on support is less valueable than dieng on carry
        const xpDiff = 0.005 * (playerStatsModel.xpDiff / playerStatsModel.games);
        const wardsPlaced = 0.1 * (playerStatsModel.wardsPlaced / playerStatsModel.games);
        const wardsKilled = 2 * (playerStatsModel.wardsKilled / playerStatsModel.games);
        const controlWards = 0.5 * (playerStatsModel.controlWardsPlaced / playerStatsModel.games)
        const killParticipation = 20 * (playerStatsModel.killParticipation / playerStatsModel.games)
        const vspm = 25 * ((playerStatsModel.visionScorePerMinute / playerStatsModel.games) - 1)
        const quickSupportQuest = 4 * (playerStatsModel.completeSupportQuestInTime / playerStatsModel.games)

        // console.log(playerStatsModel.player.name)
        // console.log(`k ${kills}`)
        // console.log(`a ${assists}`)
        // console.log(`d ${deaths}`)
        // console.log(`xpd ${xpDiff}`)
        // console.log(`wp ${wardsPlaced}`)
        // console.log(`wk ${wardsKilled}`)
        // console.log(`cw ${controlWards}`)
        // console.log(`kp ${killParticipation}`)
        // console.log(`vspm ${vspm}`)
        // console.log(`qsd ${quickSupportQuest}`)

        return kills + assists + deaths + xpDiff + wardsPlaced + wardsKilled + controlWards + killParticipation + vspm + quickSupportQuest
    }

    getJunglerStatValue(playerStatsModel: PlayerStatModel): number {
        const kda = 2.5 * (playerStatsModel.kda / playerStatsModel.games)
        const csDiff = 0.5 * (playerStatsModel.csDiff / playerStatsModel.games);
        const xpDiff = 0.01 * (playerStatsModel.xpDiff / playerStatsModel.games);
        const wardsPlaced = 1.5 * (playerStatsModel.wardsPlaced / playerStatsModel.games);
        const wardsKilled = 3 * (playerStatsModel.wardsKilled / playerStatsModel.games);
        const visionScorePerMinute = 10 * ((playerStatsModel.visionScorePerMinute / playerStatsModel.games) - 0.5)
        const perfectSoul = 30 * (playerStatsModel.perfectDragonSoulsTaken / playerStatsModel.games)
        const regularDragons = 7 * (playerStatsModel.dragonTakedowns / playerStatsModel.games)
        const heraldTakedowns = 5 *  (playerStatsModel.riftHeraldTakedowns / playerStatsModel.games)
        const barons = 10 * (playerStatsModel.baronTakedowns / playerStatsModel.games);
        const steals = 20 * (playerStatsModel.epicMonsterSteals / playerStatsModel.games)

        // console.log(playerStatsModel.player.name)
        // console.log(`kda ${kda}`)
        // console.log(`csD ${csDiff}`)
        // console.log(`xpD ${xpDiff}`)
        // console.log(`wp ${wardsPlaced}`)
        // console.log(`wk ${wardsKilled}`)
        // console.log(`vis ${visionScorePerMinute}`)
        // console.log(`per ${perfectSoul}`)
        // console.log(`reg ${regularDragons}`)
        // console.log(`her ${heraldTakedowns}`)
        // console.log(`bar ${barons}`)
        // console.log(`ste ${steals}`)

        return  kda + csDiff + xpDiff  + wardsPlaced + wardsKilled + visionScorePerMinute + perfectSoul + regularDragons + heraldTakedowns + barons + steals;
    }

    private calculateCarryStat(dpm: number, dmgTankedPM: number) {
        const blend1 = (dpm * 0.7) + (dmgTankedPM * 0.3)
        const blend2 = (dpm * 0.3) + (dmgTankedPM * 0.7)
        return Math.max(blend1, blend2)
    }

}