import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";
import {getMinutesFromRiotTime} from "../../../../common/utils";

export class DPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DPM"
    }

    getToolTip(): string {
        return "Damage Per Min";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions/ getMinutesFromRiotTime(playerStatsModel.gameLength);
    }
}