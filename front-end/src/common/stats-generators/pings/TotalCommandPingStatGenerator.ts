import {BaseStatGenerator} from "../BaseStatsGenerator";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export class TotalCommandPingStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "TCP"
    }

    getToolTip(): string {
        return "Command Pings";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.commandPings;
    }
}