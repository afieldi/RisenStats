import PlayerStatModel from '../../../../../Common/models/playerstat.model';
import { GameRatingStatGenerator } from './GameRatingStatGenerator';
import { RoleRatingStatGenerator } from './RoleRatingStatGenerator';
import AggregatedPlayerStatModel from '../../../../../Common/models/aggregatedplayerstat.model';

export class EarlyGameRatingStatGenerator extends RoleRatingStatGenerator {

  getStatTitle(): string {
    return 'Early Game Rating';
  }

  getToolTip(): string {
    return 'Rates you based on your early game stats';
  }

  getSoloLaneStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    const cs = 0.7 * (playerStatsModel.laneMinionsFirst10Minutes/playerStatsModel.games  - 60);
    const kills = (7.5 * playerStatsModel.kills15) / playerStatsModel.games;
    const assists = (4.5 * playerStatsModel.assists15) / playerStatsModel.games;
    const deaths = (-7.5 * playerStatsModel.deaths15) / playerStatsModel.games;
    const turretPlats = (4 * playerStatsModel.turretPlatesTaken) / playerStatsModel.games;
    const turretFirstBlood = (20 * playerStatsModel.takedownOnFirstTurret) / playerStatsModel.games;
    const fb = (20 * playerStatsModel.firstBloodTakedown) / playerStatsModel.games;
    const csDiff = (1.1 * playerStatsModel.csDiff15) / playerStatsModel.games;
    const xpDiff = (0.03 * playerStatsModel.xpDiff15) / playerStatsModel.games;
    const quickTurret = (30 * playerStatsModel.quickFirstTurret) / playerStatsModel.games;
    const wardsPlaced = (2.5 * playerStatsModel.wardsPlaced15) / playerStatsModel.games;
    const wardsKilled = (6 * playerStatsModel.wardsKilled15) / playerStatsModel.games;
    return cs + kills + assists + deaths + turretPlats + fb + csDiff + xpDiff + quickTurret + wardsPlaced + wardsKilled + turretFirstBlood;
  }

  getSupportStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    const kills = 7.5 * playerStatsModel.kills15;
    const assists = 5.5 * playerStatsModel.assists15;
    const deaths = -4.5 * playerStatsModel.deaths15; // Dying on support is less valueable than dying on carry
    const turretPlats = 4 * playerStatsModel.turretPlatesTaken;
    const turretFirstBlood = 30 * playerStatsModel.takedownOnFirstTurret;
    const fb = 20 * playerStatsModel.firstBloodTakedown;
    const goldDiff = 0.02 * playerStatsModel.goldDiff15;
    const xpDiff = 0.11 * playerStatsModel.xpDiff15;
    const wardsPlaced = 3 * playerStatsModel.wardsPlaced15;
    const wardsKilled = 8 * playerStatsModel.wardsKilled15;
    const quickSupportQuest = 4 * playerStatsModel.completeSupportQuestInTime;

    return  (kills + assists + deaths + turretPlats + fb + turretFirstBlood + goldDiff + xpDiff + wardsPlaced + wardsKilled + quickSupportQuest) / playerStatsModel.games;
  }

  getJunglerStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    const kills = 7.5 * playerStatsModel.kills15;
    const assists = 7.5 * playerStatsModel.assists15;
    const deaths = -7.5 * playerStatsModel.deaths15;
    const fb = 40 * playerStatsModel.firstBloodTakedown;
    const csDiff = 2 * playerStatsModel.csDiff15;
    const xpDiff = 0.05 * playerStatsModel.xpDiff15;
    const wardsPlaced = 1.5 * playerStatsModel.wardsPlaced15;
    const wardsKilled = 10 * playerStatsModel.wardsKilled15;

    return  (kills + assists + deaths  + fb + csDiff + xpDiff  + wardsPlaced + wardsKilled)  / playerStatsModel.games;
  }

}