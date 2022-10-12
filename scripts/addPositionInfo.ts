import { ensureConnection } from '../BackEnd/src/db/dbConnect';
import PlayerGameModel from '../Common/models/playergame.model';

async function AddPosition(): Promise<any> {
  await ensureConnection();
  let res = await PlayerGameModel.createQueryBuilder().select('gameGameId').distinct(true).getRawMany();
  console.log(res);
}

AddPosition();