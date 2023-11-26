export type PlayerIdentifier = {
    gameName: string,
    tagline: string
};

export type RisenTeam = {
    teamName: string,
    abrv: string,
    win: string
    loss: string
    top: PlayerIdentifier
    jungle: PlayerIdentifier,
    mid: PlayerIdentifier,
    adc: PlayerIdentifier,
    support: PlayerIdentifier,
    sub1?: PlayerIdentifier,
    sub2?: PlayerIdentifier,
    sub3?: PlayerIdentifier,
    sub4?: PlayerIdentifier,
    sub5?: PlayerIdentifier
};

export interface RisenSheetParser {
    buildTeam: (row: string[]) => RisenTeam;
    isValidRow: (row: string[]) => boolean;
}