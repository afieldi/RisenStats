import {BaseStatGenerator} from "../BaseStatsGenerator";
import {GameRoles} from "../../../../../Common/Interface/General/gameEnums";
import PlayerStatModel from "../../../../../Common/models/playerstat.model";

export abstract class GameRatingStatGenerator extends BaseStatGenerator {

    protected role;
    protected soloLanes = [
        GameRoles.MIDDLE,
        GameRoles.TOP,
        GameRoles.BOTTOM,
        GameRoles.ALL,
    ]

    constructor(role: GameRoles) {
        super();
        this.role = role;
    }

    getStatValue(playerStatsModel: PlayerStatModel): number {
        if(this.soloLanes.includes(this.role)) {
            return this.getSoloLaneStatValue(playerStatsModel);
        }
        else if (this.role === GameRoles.JUNGLE) {
            return this.getJunglerStatValue(playerStatsModel)
        } else {
            return this.getSupportStatValue(playerStatsModel)
        }
    }

    abstract getSoloLaneStatValue(playerStatsModel: PlayerStatModel): number

    abstract getJunglerStatValue(playerStatsModel: PlayerStatModel): number

    abstract getSupportStatValue(playerStatsModel: PlayerStatModel): number
}