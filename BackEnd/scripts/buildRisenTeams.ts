import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { buildRisenTeams } from '../src/business/teams';

/*
    ?? - champions
    28 - Mythical
    ?? - draft
    ?? - dom
    ?? - unstop
    ?? - ramp
 */
buildRisenTeams(28);