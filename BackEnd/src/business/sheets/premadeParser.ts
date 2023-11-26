import log from '../../../logger';
import { PlayerIdentifier, RisenSheetParser, RisenTeam } from './sheets';

export class PremadeParser implements RisenSheetParser {
  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[0],
      abrv: row[1],
      win: row[2],
      loss: row[3],
      top: this.getPlayerIdentifierFromString(row[5]),
      jungle: this.getPlayerIdentifierFromString(row[6]),
      mid: this.getPlayerIdentifierFromString(row[7]),
      adc: this.getPlayerIdentifierFromString(row[8]),
      support: this.getPlayerIdentifierFromString(row[9]),
      sub1: this.getPlayerIdentifierFromString(row[10]) ?? undefined,
      sub2: this.getPlayerIdentifierFromString(row[11]) ?? undefined,
      sub3: this.getPlayerIdentifierFromString(row[12]) ?? undefined,
      sub4: this.getPlayerIdentifierFromString(row[13]) ?? undefined,
      sub5: this.getPlayerIdentifierFromString(row[14])?? undefined,
    };
  }

  public isValidRow(data: string[]): boolean {
    // Check to make sure there's enough columns and make sure the name and abbr exist
    return data.length > 5 && this.isValidRowData(data[0]) && this.isValidRowData(data[1]) && this.hasValidOPGG(data[15]);
  }

  isValidRowData(data: string): boolean {
    return data && data.length > 1;
  }

  hasValidOPGG(url: string): boolean {
    const regex = /^http:\/\/na\.op\.gg\/multi/;
    return regex.test(url);
  }

  getPlayerIdentifierFromString(inputString: string): PlayerIdentifier {
    if (!inputString) {
      return undefined;
    }

    let splitString = inputString.split('#');

    if (splitString.length != 2) {
      log.error(`Player name, ${inputString} was invalid!`);
      return undefined;
    }

    return {
      gameName: splitString[0],
      tagline: splitString[1]
    };
  }

}

