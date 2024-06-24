import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { CreateCodes } from '../src/business/codes';
import { DOMINATE } from './scriptConstants';

async function generateCode() {
  let codeModels = await CreateCodes(DOMINATE, 3);
  for (let codeModel of codeModels) {
    console.log(`SeasonId: ${codeModel.seasonId} Code: ${codeModel.code}`);
  }

  console.log(`Created ${codeModels.length} codes`);
}

generateCode();