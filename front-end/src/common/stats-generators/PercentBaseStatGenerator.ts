import { BaseStatGenerator } from './BaseStatsGenerator';

export abstract class PercentBaseStatGenerator extends BaseStatGenerator {
    formatNumber(value: number): string {
        return `${super.formatNumber(value)}%`;
    }
}