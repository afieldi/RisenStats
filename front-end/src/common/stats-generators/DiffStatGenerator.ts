import { BaseStatGenerator } from './BaseStatsGenerator';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';

export enum DiffEnum {
    CS = 'CS',
    GOLD = 'GOLD',
    XP = 'XP',
}

const goldDiffResolver: Record<15 | 25, (x: AggregatedPlayerStatModel) => number> = {
  15 : (model: AggregatedPlayerStatModel) => model.goldDiff15,
  25 : (model: AggregatedPlayerStatModel) => model.goldDiff25
};


const xpDiffResolver: Record<15 | 25, (x: AggregatedPlayerStatModel) => number> =  {
  15: (model: AggregatedPlayerStatModel) => model.xpDiff15,
  25: (model: AggregatedPlayerStatModel) => model.xpDiff25
};

const csDiffResolver: Record<15 | 25, (x: AggregatedPlayerStatModel) => number> = {
  15: (model: AggregatedPlayerStatModel) => model.csDiff15,
  25: (model: AggregatedPlayerStatModel) => model.csDiff25,
};

const diffResolvers: Record<DiffEnum,  Record<15 | 25, (x: AggregatedPlayerStatModel) => number>> = {
  GOLD: goldDiffResolver,
  XP: xpDiffResolver,
  CS: csDiffResolver
};

export class DiffStatGenerator extends BaseStatGenerator {

  protected atValue: number;
  protected diffValue: DiffEnum;
  protected resolver: (x: AggregatedPlayerStatModel) => number;

  constructor(diffValue: DiffEnum, atValue: 15 | 25) {
    super();
    this.atValue = atValue;
    this.diffValue = diffValue;
    if(diffResolvers[diffValue]?.[atValue]) {
      this.resolver = diffResolvers[diffValue][atValue];
    } else {
      this.resolver = (model: AggregatedPlayerStatModel) => {return model.goldDiff;};
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

  getStatValue(playerStatsModel: AggregatedPlayerStatModel): number {
    return this.resolver(playerStatsModel) /  playerStatsModel.games;
  }
}