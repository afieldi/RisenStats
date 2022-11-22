import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DPM"
    }

    getToolTip(): string {
        return "Damage Per Min";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        let minutes = playerStatsModel.gameLength / 60
        return playerStatsModel.totalDamageDealtToChampions/minutes;
    }
}