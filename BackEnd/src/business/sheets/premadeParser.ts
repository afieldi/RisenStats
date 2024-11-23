import {  RisenSheetParser, RisenTeam } from './sheets';
import { getPlayerIdentifierFromString, hasValidOPGG } from './parserHelpers';

export class PremadeParser implements RisenSheetParser {
  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[0],
      abrv: row[1],
      win: row[2],
      loss: row[3],
      top: getPlayerIdentifierFromString(row[5]),
      jungle: getPlayerIdentifierFromString(row[6]),
      mid: getPlayerIdentifierFromString(row[7]),
      adc: getPlayerIdentifierFromString(row[8]),
      support: getPlayerIdentifierFromString(row[9]),
      sub1: getPlayerIdentifierFromString(row[10]) ?? undefined,
      sub2: getPlayerIdentifierFromString(row[11]) ?? undefined,
      sub3: getPlayerIdentifierFromString(row[12]) ?? undefined,
      sub4: getPlayerIdentifierFromString(row[13]) ?? undefined,
      sub5: getPlayerIdentifierFromString(row[14]) ?? undefined,
    };
  }

  public isValidRow(data: string[]): boolean {
    // Check to make sure there's enough columns and make sure the name and abbr exist
    // If a row has a opgg then we know its a team row and not a filler row.
    return data.length > 5 && this.isValidRowData(data[0]) && this.isValidRowData(data[1]) && hasValidOPGG(data[15]);
  }

  isValidRowData(data: string): boolean {
    return data && data.length > 1;
  }
}

