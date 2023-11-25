import { RisenSheetParser, RisenTeam } from './sheets';
// TODO when we have reqs for draft
export class DraftParser implements RisenSheetParser {
  public buildTeam(row: any[]): RisenTeam {
    return null;
  }

  public isValidRow(data: string[]): boolean {
    return false;
  }
}