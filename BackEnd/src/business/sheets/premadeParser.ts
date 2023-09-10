import { addPlayersToTeams, addTeamToDB, isValidRowData, RisenSheetParser, RisenTeam } from '../teams';

export class PremadeParser implements RisenSheetParser {
  async buildTeamsForLeague(sheet: any[][], sheetName: string, seasonId: number) {
    let risenSheetTeams = this.getRisenSheetTeams(sheet);

    // Add team teams
    for (let risenSheetTeam of risenSheetTeams) {
      await addTeamToDB(risenSheetTeam, seasonId);
    }

    // Add the players to their respective teams
    for (let risenSheetTeam of risenSheetTeams) {
      await addPlayersToTeams(seasonId, risenSheetTeam);
    }
  }

  public getRisenSheetTeams(sheet: any[][]): RisenTeam[] {
    let risenSheetTeams: RisenTeam[] = [];

    for (let [index, row] of sheet.entries()) {
      if (index == 0 || !this.isValidRow(row)) {
        continue; // Ignore headers and divs
      }
      risenSheetTeams.push(this.buildTeam(row));
    }
    return risenSheetTeams;
  }

  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[0],
      abrv: row[1],
      win: row[2],
      loss: row[3],
      top: row[5],
      jungle: row[6],
      mid: row[7],
      adc: row[8],
      support: row[9],
      sub1: row[10] ?? undefined,
      sub2: row[11] ?? undefined,
      sub3: row[12] ?? undefined,
      sub4: row[13] ?? undefined,
      sub5: row[14] ?? undefined,
    };
  }

  isValidRow(data: string[]): boolean {
    // Check to make sure there's enough columns and make sure the name and abbr exist
    return data.length > 5 && isValidRowData(data[0]) && isValidRowData(data[1]) && this.hasValidOPGG(data[15]);
  }

  hasValidOPGG(url: string): boolean {
    const regex = /^http:\/\/na\.op\.gg\/multi/;
    return regex.test(url);
  }
}

