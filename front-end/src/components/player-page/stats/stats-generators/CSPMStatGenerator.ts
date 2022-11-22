import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class CSPMStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "CSPM"
    }

    getToolTip(): string {
        return "CS Per Min";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        let minute = playerStatsModel.gameLength / 60
        return (playerStatsModel.totalMinionsKilled + playerStatsModel.enemyJungleMonsterKills + playerStatsModel.alliedJungleMonsterKills) /  minute;
    }
}