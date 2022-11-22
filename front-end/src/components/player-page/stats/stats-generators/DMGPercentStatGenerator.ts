import {BaseStatGenerator} from "./BaseStatsGenerator";
import PlayerStatModel from "../../../../../../Common/models/playerstat.model";

export class DMGPercentStatGenerator extends BaseStatGenerator {
    getStatTitle(): string {
        return "DMG %"
    }

    getToolTip(): string {
        return "Damage Share";
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        return playerStatsModel.totalDamageDealtToChampions/ playerStatsModel.totalDamageDealtToChampionsOfTeam * 100;
    }
}