import { RisenSheetParser, RisenTeam } from './sheets';
import { getPlayerIdentifierFromString, hasValidOPGG } from './parserHelpers';
export class DraftParser implements RisenSheetParser {
  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[1], // n-1
      abrv: row[2],
      win: row[4],
      loss: row[5],
      top: getPlayerIdentifierFromString(row[10]),
      jungle: getPlayerIdentifierFromString(row[12]),
      mid: getPlayerIdentifierFromString(row[14]),
      adc: getPlayerIdentifierFromString(row[16]),
      support: getPlayerIdentifierFromString(row[18]),
      sub1: undefined, // No defined subs in draft league
      sub2: undefined,
      sub3: undefined,
      sub4: undefined,
      sub5: undefined,
    };
  }

  public isValidRow(data: string[]): boolean {
    return data.length > 5 && this.isValidRowData(data[1]) && this.isValidRowData(data[2]) && hasValidOPGG(data[20]);
  }

  isValidRowData(data: string): boolean {
    return data && data.length > 1;
  }
}