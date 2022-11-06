import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DPMStatGenerator extends BaseStatGenerator {
    getStatValue(playerStatsModels: PlayerStatModel[]): string {
        let dmg = 0
        let time = 0;
        for (let playerStatsModel of playerStatsModels) {
            dmg += playerStatsModel.totalDamageDealtToChampions;
            time += playerStatsModel.gameLength;
        }

        let minutes = time / 60
        return `${this.formatNumber(dmg/minutes)}` ;
    }

    getStatTitle(): string {
        return "DPM"
    }

    getToolTip(): string {
        return "Damage Per Min";
    }
}