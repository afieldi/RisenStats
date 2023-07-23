import { addPlayersToTeams, addTeamToDB, isValidRowData, RisenSheetParser, RisenTeam } from '../teams';

export class PremadeParser implements RisenSheetParser {
  async buildTeamsForLeague(sheet: any[][], sheetName: string, seasonId: number) {
    let risenSheetTeams: RisenTeam[] = [];

    for (let [index, row] of sheet.entries()) {
      if (index == 0 || !this.isValidRow(row)) {
        continue; // Ignore headers and divs
      }
      risenSheetTeams.push(this.buildTeam(row));
    }

    // Add team teams
    for (let risenSheetTeam of risenSheetTeams) {
      await addTeamToDB(risenSheetTeam, seasonId);
    }

    // Add the players to their respective teams
    for (let risenSheetTeam of risenSheetTeams) {
      await addPlayersToTeams(seasonId, risenSheetTeam);
    }
  }

  public buildTeam(row: any[]): RisenTeam {
    return {
      teamName: row[0],
      abrv: row[2],
      win: row[4],
      loss: row[5],
      top: row[7],
      jungle: row[8],
      mid: row[9],
      adc: row[10],
      support: row[11],
      sub1: row[12] ?? undefined,
      sub2: row[13] ?? undefined,
      sub3: row[14] ?? undefined,
      sub4: row[15] ?? undefined,
      sub5: row[16] ?? undefined,
    };
  }

  isValidRow(data: string[]): boolean {
    // Check to make sure there's enough columns and make sure the name and abbr exist
    return data.length > 5 && isValidRowData(data[0]) && isValidRowData(data[2]);
  }
}

