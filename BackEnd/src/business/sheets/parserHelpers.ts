import { PlayerIdentifier } from './sheets';
import log from '../../../logger';

export function hasValidOPGG(url: string): boolean {
  const regex = /^http:\/\/na\.op\.gg\/multi/;
  const newOPGGRegex = /^http:\/\/na\.op\.gg\/multisearch/;
  return regex.test(url) || newOPGGRegex.test(url);
}

export function getPlayerIdentifierFromString(inputString: string): PlayerIdentifier {
  if (!inputString) {
    return undefined;
  }

  if(!inputString.includes('#')) {
    log.error(`Player name, ${inputString} was invalid!, no # to seperate!`);
    return undefined;
  }

  let splitString = inputString.split('#');

  if (splitString.length != 2) {
    log.error(`Player name, ${inputString} was invalid!`);
    return undefined;
  }

  return {
    gameName: splitString[0].trim(),
    tagline: splitString[1].trim()
  };
}