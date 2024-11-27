import { RisenSheetParser, RisenTeam } from './sheets';
import { getPlayerIdentifierFromString, hasValidOPGG } from './parserHelpers';
export class DraftParser implements RisenSheetParser {
  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[0],
      abrv: row[1],
      win: row[2],
      loss: row[3],
      top: getPlayerIdentifierFromString(row[7]),
      jungle: getPlayerIdentifierFromString(row[9]),
      mid: getPlayerIdentifierFromString(row[11]),
      adc: getPlayerIdentifierFromString(row[13]),
      support: getPlayerIdentifierFromString(row[15]),
      sub1: undefined, // No defined subs in draft league
      sub2: undefined,
      sub3: undefined,
      sub4: undefined,
      sub5: undefined,
    };
  }

  public isValidRow(data: string[]): boolean {
    return data.length > 5 && this.isValidRowData(data[0]) && this.isValidRowData(data[1]) && hasValidOPGG(data[17]);
  }

  isValidRowData(data: string): boolean {
    return data && data.length > 1;
  }
}