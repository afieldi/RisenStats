import { BaseEntity, Connection, createConnection, getConnection, getConnectionManager, getConnectionOptions, Repository } from 'typeorm'
import PlayerModel from '../../../Common/models/player.model'
import CodeModel from '../../../Common/models/code.model'
import GameModel from '../../../Common/models/game.model'
import GameEventModel from '../../../Common/models/gameevent.model'
import PlayerGameModel from '../../../Common/models/playergame.model'
import ProviderModel from '../../../Common/models/provider.model'
import SeasonModel from '../../../Common/models/season.model'
import BanModel from '../../../Common/models/ban.model'
import LeaderboardModel from '../../../Common/models/leaderboard.model'
import PlayerChampionStatsModel from '../../../Common/models/playerchampionstats.model'
import PlayerStatModel from "../../../Common/models/playerstat.model";
import { toSearchName } from '../../../Common/utils'

const POSTGRES_URI = process.env.POSTGRES_URI
export const ALL_TOURNAMENT_GAMES_NAME = 'ALL TOURNAMENT GAMES'; // DO NOT TOUCH
export let ALL_TOURNAMENT_GAMES_ID: number = undefined;
export const ALL_RISEN_GAMES_NAME = 'ALL RISEN GAMES'; // DO NOT TOUCH
export let ALL_RISEN_GAMES_ID: number = undefined;

if (!POSTGRES_URI) {
  throw new Error(
    'Please define the POSTGRES_URI environment variable inside .env.development'
  )
}
const options = {
  default: {
    type: 'postgres',
    host: POSTGRES_URI,
    username: process.env.POSTGRES_UN,
    password: process.env.POSTGRES_PW,
    database: process.env.POSTGRES_DB,
    bigNumberStrings: false,
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
      PlayerChampionStatsModel,
      PlayerStatModel,
    ]
  }
}

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true
  }

  return false
}

async function updateConnectionEntities(connection: Connection, entities: any[]): Promise<void> {
  // @ts-expect-error
  if (!entitiesChanged(connection.options.entities, entities)) return

  // @ts-expect-error
  connection.options.entities = entities

  // @ts-expect-error
  connection.buildMetadatas()

  if (connection.options.synchronize) {
    await connection.synchronize()
  }
}

async function createDefaultSeason(seasonName: string): Promise<SeasonModel> {
  const season = await SeasonModel.findOne({where: { searchname: toSearchName(seasonName) }});
  if (season) return season;

  return await SeasonModel.create({
    seasonName,
    searchname: toSearchName(seasonName),
    active: false,
    tourneyId: 0
  }).save();
}

export async function ensureConnection(name: string = 'default'): Promise<Connection> {
  const connectionManager = getConnectionManager()

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name)

    if (!connection.isConnected) {
      await connection.connect()
    }

    if (process.env.NODE_ENV !== 'production') {
      // @ts-expect-error
      await updateConnectionEntities(connection, options[name].entities)
    }

    if (!ALL_RISEN_GAMES_ID) {
      ALL_RISEN_GAMES_ID = (await createDefaultSeason(ALL_RISEN_GAMES_NAME)).id;
    }

    if (!ALL_TOURNAMENT_GAMES_ID) {
      ALL_TOURNAMENT_GAMES_ID = (await createDefaultSeason(ALL_TOURNAMENT_GAMES_NAME)).id;
    }

    return connection
  }

  // @ts-expect-error
  return await connectionManager.create({ name, ...options[name] }).connect()
}

export async function SaveObjects(items: BaseEntity[], type?: typeof BaseEntity): Promise<BaseEntity[]> {
  await ensureConnection()
  if (type) {
    return await type.save(items);
  }
  await getConnection().manager.save(items)
  return items
}
