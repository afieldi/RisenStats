import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { buildRisenTeams } from '../src/business/teams';
import { CHAMPIONS, DOMINATE, DRAFT, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';

/*
    ?? - champions
    61 - Mythical
    62 - draft
    32 - dom
    31 - unstop
    30 - ramp
 */
buildRisenTeams(DRAFT);