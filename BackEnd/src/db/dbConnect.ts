import { Connection, createConnection, getConnection, getConnectionManager, getConnectionOptions, Repository } from 'typeorm'
import PlayerModel from '../../../models/player.model'
import CodeModel from '../../../models/code.model'
import GameModel from '../../../models/game.model'
import GameEventModel from '../../../models/gameevent.model'
import PlayerGameModel from '../../../models/playergame.model'
import ProviderModel from '../../../models/provider.model'
import SeasonModel from '../../../models/season.model'
import BanModel from '../../../models/ban.model'
import LeaderboardModel from '../../../models/leaderboard.model'

const POSTGRES_URI = process.env.POSTGRES_URI

if (!POSTGRES_URI) {
  throw new Error(
    'Please define the POSTGRES_URI environment variable inside .env.local'
  )
}
const options = {
  default: {
    type: 'postgres',
    host: POSTGRES_URI,
    username: "postgres",
    password: "password",
    database: 'test',
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [
      BanModel,
      LeaderboardModel,
      PlayerModel,
      ProviderModel,
      GameModel,
      CodeModel,
      GameEventModel,
      PlayerGameModel,
      SeasonModel,
    ]
  },
};

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(connection: Connection, entities: any[]) {
  // @ts-ignore
  if (!entitiesChanged(connection.options.entities!, entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

export async function ensureConnection(name: string = 'default'): Promise<Connection> {
  const connectionManager = getConnectionManager();

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);

    if (!connection.isConnected) {
      await connection.connect();
    }

    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      await updateConnectionEntities(connection, options[name].entities);
    }

    return connection;
  }

  // @ts-ignore
  return await connectionManager.create({ name, ...options[name] }).connect();
}