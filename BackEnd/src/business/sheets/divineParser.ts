import { addPlayersToTeams, addTeamToDB, isValidRowData, RisenSheetParser, RisenTeam } from '../teams';

export class DivineParser implements RisenSheetParser {
  async buildTeamsForLeague(sheet: any[][], sheetName: string, seasonId: number) {
    // TODO when we get some consitency
  }
}