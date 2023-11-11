import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { buildRisenTeams } from '../src/business/teams';

/*
    22 - champions
    23 - Diviine
    24 - draft
    25 - dom
    26 - unstop
    27 - ramp
 */
buildRisenTeams(27);