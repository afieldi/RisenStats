import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DamageTakenPerMinuteStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DTPM"
    }

    getToolTip(): string {
        return "Damage Taken Per Min";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        let minutes =  playerStatsModel.gameLength / 60
        return playerStatsModel.totalDamageTaken / minutes;
    }
}