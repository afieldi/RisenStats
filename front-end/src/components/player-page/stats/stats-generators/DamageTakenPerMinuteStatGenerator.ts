import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DamageTakenPerMinuteStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let dmgTaken = 0
        let time = 0;
        for (let playerStatsModel of playerStatsModels) {
            dmgTaken += playerStatsModel.totalDamageTaken;
            time += playerStatsModel.gameLength;
        }

        let minutes = time / 60
        return `${this.formatNumber(dmgTaken/minutes)}` ;
    }

    getStatTitle(): string {
        return "DTPM"
    }

    getToolTip(): string {
        return "Damage Taken Per Min";
    }
}