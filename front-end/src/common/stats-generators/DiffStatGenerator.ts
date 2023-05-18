import { BaseStatGenerator } from './BaseStatsGenerator';
import PlayerStatModel from '../../../../Common/models/playerstat.model';

export enum DiffEnum {
    CS = 'CS',
    GOLD = 'GOLD',
    XP = 'XP',
}

const goldDiffResolver: Record<15 | 25, (x: PlayerStatModel) => number> = {
  15 : (model: PlayerStatModel) => model.goldDiff15,
  25 : (model: PlayerStatModel) => model.goldDiff25
};


const xpDiffResolver: Record<15 | 25, (x: PlayerStatModel) => number> =  {
  15: (model: PlayerStatModel) => model.xpDiff15,
  25: (model: PlayerStatModel) => model.xpDiff25
};

const csDiffResolver: Record<15 | 25, (x: PlayerStatModel) => number> = {
  15: (model: PlayerStatModel) => model.csDiff15,
  25: (model: PlayerStatModel) => model.csDiff25,
};

const diffResolvers: Record<DiffEnum,  Record<15 | 25, (x: PlayerStatModel) => number>> = {
  GOLD: goldDiffResolver,
  XP: xpDiffResolver,
  CS: csDiffResolver
};

export class DiffStatGenerator extends BaseStatGenerator {

  protected atValue: number;
  protected diffValue: DiffEnum;
  protected resolver: (x: PlayerStatModel) => number;

  constructor(diffValue: DiffEnum, atValue: 15 | 25) {
    super();
    this.atValue = atValue;
    this.diffValue = diffValue;
    if(diffResolvers[diffValue]?.[atValue]) {
      this.resolver = diffResolvers[diffValue][atValue];
    } else {
      this.resolver = (model: PlayerStatModel) => {return model.goldDiff;};
    }
  }

  formatNumber(value: number): string {
    return value > 0 ? `+${super.formatNumber(value)}` : super.formatNumber(value);
  }

  getStatTitle(): string {
    return `${this.diffValue}D @${this.atValue}`;
  }

  getToolTip(): string {
    return `${this.diffValue} diff vs your lane opponent @${this.atValue} mins`;
  }

  getStatValue(playerStatsModel: PlayerStatModel): number {
    return this.resolver(playerStatsModel) /  playerStatsModel.games;
  }
}