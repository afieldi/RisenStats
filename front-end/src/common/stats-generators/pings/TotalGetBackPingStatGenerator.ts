import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalGetBackPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TGB"
    }

    getToolTip(): string {
        return "Get Back Pings";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.getBackPings;
    }
}