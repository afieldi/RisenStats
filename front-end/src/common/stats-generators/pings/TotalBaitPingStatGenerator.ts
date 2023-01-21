import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalBaitPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TPB"
    }

    getToolTip(): string {
        return "Bait Pings";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.baitPings;
    }
}