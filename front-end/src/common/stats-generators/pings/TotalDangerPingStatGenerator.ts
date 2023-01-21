import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalDangerPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TDP"
    }

    getToolTip(): string {
        return "Danger Pings";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.dangerPings;
    }
}