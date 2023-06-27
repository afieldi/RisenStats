import { GameRoles } from '../../../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { GameRatingStatGenerator } from './GameRatingStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export abstract class RoleRatingStatGenerator extends GameRatingStatGenerator {
  protected role;
  protected soloLanes = [
    GameRoles.MIDDLE,
    GameRoles.TOP,
    GameRoles.BOTTOM,
    GameRoles.ALL,
  ];

  constructor(role: GameRoles) {
    super();
    this.role = role;
  }

  getRawStatValue(playerStatsModel: AggregatedPlayerStatModel): number  {
    let rating: number;
    if(this.soloLanes.includes(this.role)) {
      rating = this.getSoloLaneStatValue(playerStatsModel);
    }
    else if (this.role === GameRoles.JUNGLE) {
      rating = this.getJunglerStatValue(playerStatsModel);
    } else {
      rating = this.getSupportStatValue(playerStatsModel);
    }
    return rating;
  }

  abstract getSoloLaneStatValue(playerStatsModel: AggregatedPlayerStatModel): number;

  abstract getJunglerStatValue(playerStatsModel: AggregatedPlayerStatModel): number;

  abstract getSupportStatValue(playerStatsModel: AggregatedPlayerStatModel): number;
}