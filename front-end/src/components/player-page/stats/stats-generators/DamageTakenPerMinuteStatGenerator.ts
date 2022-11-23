import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";
import {getMinutesFromRiotTime} from "../../../../common/utils";

export class DamageTakenPerMinuteStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DTPM"
    }

    getToolTip(): string {
        return "Damage Taken Per Min";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageTaken / getMinutesFromRiotTime(playerStatsModel.gameLength);
    }
}