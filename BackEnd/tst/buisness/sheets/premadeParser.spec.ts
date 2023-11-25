import { describe, expect, test } from '@jest/globals';
import { PremadeParser } from '../../../src/business/sheets/premadeParser';
import { RisenTeam } from '../../../src/business/sheets/sheets';

describe('Build Risen Team Cases', () => {
  const premadeParser: PremadeParser = new PremadeParser();
  const rowFromSheet: String[] = [
    'TeamName',
    'TN',
    '1',
    '0',
    '',
    'Vexrax#FAN',
    'Vexrax#FAKER',
    'Earleking#NA1',
    'Runner90#NA1',
    'rgrou2#NA1',
    'Sushimunster#NA1',
    undefined,
    undefined,
    undefined,
    undefined,
    'https://www.op.gg/multisearch/na?summoners=%C3%90emo,F1NALN1NJA,%C3%9Firdo,rAndOmCaPitALs,soulbert,rgrou2,caf%C3%A9cioccolata,fossildyna,Granterino,enemycombatant,https://www.op.gg/multisearch/na?summoners=%C3%90emo,F1NALN1NJA,%C3%9Firdo,rAndOmCaPitALs,soulbert,rgrou2,caf%C3%A9cioccolata,fossildyna,Granterino,enemycombatant,'
  ];

  test('Build the RisenTeam Object Correctly', async() => {
    let builtTeam: RisenTeam = premadeParser.buildTeam(rowFromSheet);
    expect(builtTeam.teamName).toEqual(rowFromSheet[0]);
    expect(builtTeam.abrv).toEqual(rowFromSheet[1]);
    expect(builtTeam.win).toEqual(rowFromSheet[2]);
    expect(builtTeam.loss).toEqual(rowFromSheet[3]);

    expect(builtTeam.top.gameName).toEqual('Vexrax');
    expect(builtTeam.top.tagline).toEqual('FAN');

    expect(builtTeam.jungle.gameName).toEqual('Vexrax');
    expect(builtTeam.jungle.tagline).toEqual('FAKER');

    expect(builtTeam.mid.gameName).toEqual('Earleking');
    expect(builtTeam.mid.tagline).toEqual('NA1');

    expect(builtTeam.adc.gameName).toEqual('Runner90');
    expect(builtTeam.adc.tagline).toEqual('NA1');

    expect(builtTeam.support.gameName).toEqual('rgrou2');
    expect(builtTeam.support.tagline).toEqual('NA1');

    expect(builtTeam.sub1.gameName).toEqual('Sushimunster');
    expect(builtTeam.sub1.tagline).toEqual('NA1');
  });
});