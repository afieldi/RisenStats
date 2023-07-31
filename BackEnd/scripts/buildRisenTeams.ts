import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { buildRisenTeams } from '../src/business/teams';

buildRisenTeams(19);