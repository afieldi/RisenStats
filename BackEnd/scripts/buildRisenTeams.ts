import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { buildRisenTeams } from '../src/business/teams';

/*
    ?? - champions
    28 - Mythical
    29 - draft
    32 - dom
    31 - unstop
    30 - ramp
 */
buildRisenTeams(30);