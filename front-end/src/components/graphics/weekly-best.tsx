import { Box, Container, Theme, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import RisenBanner from '../banner/banner';
import ImgBox from '../risen-box/img-box';
import GameModel from '../../../../Common/models/game.model';
import PlayerGameModel from '../../../../Common/models/playergame.model';
import { GetGamesByUTCTime } from '../../api/games';
import AllTeamInfo from '../player-page/game-summary/all-team-info';
import BaseRisenBox from '../risen-box/base-risen-box';
import PlayerChampBanner, { PlayerChampBanners } from '../banner/player-champ-banner';
import Comparator from '../comparator/comparator';
import { deepCopy, getTotalCS, riotTimestampToGameTime, roundTo, toPerMinute } from '../../../../Common/utils';
import { StatGenerators } from '../../common/constants';
import GamesFilter from '../filters/games-filter';
import SeasonModel from '../../../../Common/models/season.model';
import { DEFAULT_RISEN_SEASON_ID } from '../../../../Common/constants';
import { GetActiveSeasons, GetAllSeasons } from '../../api/season';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';
import { GetPlayerStatsByTimeAndSeason } from '../../api/player';
import { getRoleIcon, getTeamStats } from '../../common/utils';

interface MostDatum<T> {
  item: T | null;
  limit: number | null;
  get: (o: T) => number;
  least: boolean;
}

interface MostData extends Record<string, MostDatum<any>> {
  kills: MostDatum<AggregatedPlayerStatModel>;
  cs: MostDatum<AggregatedPlayerStatModel>;
  goldEarned: MostDatum<AggregatedPlayerStatModel>;
  damage: MostDatum<AggregatedPlayerStatModel>;
  visionScore: MostDatum<AggregatedPlayerStatModel>;
}

interface BestGames extends Record<string, MostDatum<any>> {
  mostKills: MostDatum<GameModel | null>;
  leastKills: MostDatum<GameModel | null>;
  longest: MostDatum<GameModel | null>;
  shortest: MostDatum<GameModel | null>;
}

interface BestPlayers extends Record<string, MostDatum<any>> {
  top: MostDatum<AggregatedPlayerStatModel>;
  jungle: MostDatum<AggregatedPlayerStatModel>;
  mid: MostDatum<AggregatedPlayerStatModel>;
  bot: MostDatum<AggregatedPlayerStatModel>;
  supp: MostDatum<AggregatedPlayerStatModel>;
}

interface GameStatSum {
  kills: number;
  length: number;
}

const defaultMostData: MostData = {
  kills: {
    item: null,
    limit: null,
    least: false,
    get: o => roundTo(o.kills / o.games, 2),
  },
  cs: {
    item: null,
    limit: null,
    least: false,
    get: o => roundTo(getTotalCS(o) / o.games, 2),
  },
  damage: {
    item: null,
    limit: null,
    least: false,
    get: o => roundTo(o.totalDamageDealtToChampions / o.games, 2),
  },
  visionScore: {
    item: null,
    limit: null,
    least: false,
    get: o => roundTo(o.visionScore / o.games, 2),
  },
  goldEarned: {
    item: null,
    limit: null,
    least: false,
    get: o => roundTo(o.goldEarned / o.games, 2),
  },
};

const defaultBestPlayers: BestPlayers = {
  top: {
    item: null,
    limit: null,
    least: false,
    get: o => o.lobbyPosition === 'TOP' ? StatGenerators.OVERALL_GAME_RATING_SOLO_LANE.getRawStatValue(o) : -1,
  },
  jungle: {
    item: null,
    limit: null,
    least: false,
    get: o => o.lobbyPosition === 'JUNGLE' ? StatGenerators.OVERALL_GAME_RATING_JUNGLER.getRawStatValue(o) : -1,
  },
  mid: {
    item: null,
    limit: null,
    least: false,
    get: o => o.lobbyPosition === 'MIDDLE' ? StatGenerators.OVERALL_GAME_RATING_SOLO_LANE.getRawStatValue(o) : -1,
  },
  bot: {
    item: null,
    limit: null,
    least: false,
    get: o =>  o.lobbyPosition === 'BOTTOM' ? StatGenerators.OVERALL_GAME_RATING_SOLO_LANE.getRawStatValue(o) : -1,
  },
  supp: {
    item: null,
    limit: null,
    least: false,
    get: o => o.lobbyPosition === 'SUPPORT' ? StatGenerators.OVERALL_GAME_RATING_SUPPORT.getRawStatValue(o) : -1,
  }
};

const defaultBestGames: BestGames = {
  mostKills: {
    item: null,
    limit: null,
    least: false,
    get: o => getTeamStats(o!).total.kills
  },
  leastKills: {
    item: null,
    limit: null,
    least: true,
    get: o => getTeamStats(o!).total.kills
  },
  longest: {
    item: null,
    limit: null,
    least: false,
    get: o => o!.gameDuration
  },
  shortest: {
    item: null,
    limit: null,
    least: true,
    get: o => o!.gameDuration
  }
};

const MS_IN_A_WEEK = 604800000;

const mapBestPlayersToChampBanner = (bestPlayers: BestPlayers, playerGames: { [key: string]: PlayerGameModel[] }): PlayerChampBanners => {
  return {
    top: {
      stats: bestPlayers.top.item!,
      championPortraitId: playerGames[bestPlayers.top.item?.playerPuuid!][0].championId
    },
    jungle: {
      stats: bestPlayers.jungle.item!,
      championPortraitId: playerGames[bestPlayers.jungle.item?.playerPuuid!][0].championId
    },
    mid: {
      stats: bestPlayers.mid.item!,
      championPortraitId: playerGames[bestPlayers.mid.item?.playerPuuid!][0].championId
    },
    bot: {
      stats: bestPlayers.bot.item!,
      championPortraitId: playerGames[bestPlayers.bot.item?.playerPuuid!][0].championId
    },
    supp: {
      stats: bestPlayers.supp.item!,
      championPortraitId: playerGames[bestPlayers.supp.item?.playerPuuid!][0].championId
    },
  };
};

export default function WeeklyBest() {
  const colors = [
    '#663F46',
    '#3C362A',
    '#C9D6EA',
    '#AA968A',
    '#6E6A6F',
  ];


  const backgroundShading = { background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.3) 10%, rgba(0,0,0,.3) 90%, rgba(0,0,0,0) 100%)', pt: 3, pb: 3, };

  const verticalBackground = { background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.3) 10%, rgba(0,0,0,.3) 90%, rgba(0,0,0,0) 100%)' };
  const theme = useTheme() as Theme;

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [gameData, setGameData] = useState<GameModel[]>([]);
  const [playerGameData, setPlayerGameData] = useState<PlayerGameModel[]>([]);
  const [seasonId, setSeasonId] = useState<string>(DEFAULT_RISEN_SEASON_ID);
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);

  const gameMap: { [gameId: string]: GameModel } = {};
  const playerGameMap: { [playerPuuid: string]: GameModel[] } = {};

  const seasonConfig = {
    seasonId,
    setSeasonId,
    seasons,
  };

  // Player data group by player
  const [groupedPlayerGameData, setGroupedPlayerGameData] = useState<{ [key: string]: PlayerGameModel[] }>({});

  const [mostStats, setMostStats] = useState<MostData>(defaultMostData);
  const [bestGames, setBestGames] = useState<BestGames>(defaultBestGames);
  const [bestPlayers, setBestPlayers] = useState<BestPlayers>(defaultBestPlayers);

  const getData = async() => {
    if (seasonId === DEFAULT_RISEN_SEASON_ID) {
      return;
    }
    const { games, playerGames } = await GetGamesByUTCTime((new Date()).getTime() - MS_IN_A_WEEK, (new Date()).getTime(), seasonId);
    const { playerStats } = await GetPlayerStatsByTimeAndSeason(Number(seasonId), (new Date()).getTime() - MS_IN_A_WEEK, (new Date()).getTime());
    setGameData(games);
    populateGameMap(games);
    aggreatePlayerGames(playerGames);
    setPlayerGameData(playerGames);
    setMostStats(calculateMostStats(playerStats, defaultMostData) as MostData);
    setBestPlayers(calculateMostStats(playerStats, defaultBestPlayers) as BestPlayers);
    setBestGames(calculateMostStats(games, defaultBestGames) as BestGames);
    setDataLoaded(true);
  };

  const calculateMostStats = <T,>(statData: T[], defaultData: Record<string, MostDatum<T>>): Record<string, MostDatum<T>> => {
    const data = defaultData;
    // Cursed typing :)
    for (const key of (Object.keys(data) as (keyof typeof data)[])) {
      data[key] = { ...defaultData[key] };
      for (const stat of statData) {
        const currentStat = data[key].get(stat);
        if (data[key].limit === null || 
          (data[key].limit! < currentStat && data[key].least === false) ||
          (data[key].limit! > currentStat && data[key].least === true)) {
          data[key].limit = currentStat;
          data[key].item = stat;
        }
      }
    }
    return data;
  };

  const aggreatePlayerGames = (games: PlayerGameModel[]) => {
    const tmp: { [key: string]: PlayerGameModel[] } = {};
    for (const game of games) {
      if (!tmp[game.playerPuuid]) {
        tmp[game.playerPuuid] = [];
      }
      tmp[game.playerPuuid].push(game);
    }
    setGroupedPlayerGameData(tmp);
    return tmp;
  };

  const populateGameMap = (games: GameModel[]) => {
    for (const game of games) {
      gameMap[game.gameId] = game;
    }
  };

  useEffect(() => {
    getData();
  }, [seasonId]);

  useEffect(() => {
    GetActiveSeasons().then(seasonData => setSeasons(seasonData.seasons));
  }, []);


  const topBannerWidth = 170; // Bruh idk. Sometimes there are 1px misalignments. 149 seems to work. 150 is bad
  // console.log(theme);
  return (
    <Container>
      <Box>
        <Typography>Season Selector</Typography>
        <GamesFilter sx={{ mb: 2 }} useSeason={true} seasonConfig={seasonConfig} useRole={false} hideAllGames={true} />
        <hr></hr>
      </Box>
      {
        dataLoaded ? (
          <Box sx={{ width: '1000px', height: '1500px', border: '1px white solid' }}>
            {/* Top Banners */}
            <Box sx={{ display: 'flex', columnGap: 1.5, justifyContent: 'space-evenly' }}>
              <RisenBanner sx={{ width: topBannerWidth, backgroundColor: colors[0], color: 'white' }}>
                <Box sx={backgroundShading}>
                  <Typography fontFamily="Montserrat">Most</Typography>
                  <Typography fontFamily="Montserrat">Kills</Typography>
                  <Box sx={{ pb: .5 }}>
                    <ImgBox
                      sx={{ margin: 'auto' }}
                      width='75px'
                      height='75px'
                      src={getRoleIcon(mostStats.kills.item?.lobbyPosition!)}
                    />
                  </Box>
                  <Typography fontFamily="Montserrat">{mostStats.kills.item?.player.name}</Typography>
                  <Box>
                    <Typography fontFamily="Montserrat" variant='subtitle1' display='inline-block'>{mostStats.kills.limit}</Typography>
                    <Typography variant='caption' display='inline-block' fontStyle='italic' color={theme.palette.info.light} >/game</Typography>
                  </Box>
                </Box>
              </RisenBanner>

              <RisenBanner sx={{ width: topBannerWidth, backgroundColor: colors[1], color: 'white' }}>
                <Box sx={backgroundShading}>
                  <Typography fontFamily="Montserrat">Most</Typography>
                  <Typography fontFamily="Montserrat">CS</Typography>
                  <Box sx={{ pb: .5 }}>
                    <ImgBox
                      sx={{ margin: 'auto' }}
                      width='75px'
                      height='75px'
                      src={getRoleIcon(mostStats.cs.item?.lobbyPosition!)}
                    />
                  </Box>
                  <Typography fontFamily="Montserrat">{mostStats.cs.item?.player.name}</Typography>
                  <Box>
                    <Typography fontFamily="Montserrat" variant='subtitle1' display='inline-block'>{mostStats.cs.limit}</Typography>
                    <Typography variant='caption' display='inline-block' fontStyle='italic' color={theme.palette.info.light} >/game</Typography>
                  </Box>
                </Box>
              </RisenBanner>

              <RisenBanner sx={{ width: topBannerWidth, backgroundColor: colors[2], color: 'white' }}>
                <Box sx={backgroundShading}>
                  <Typography fontFamily="Montserrat">Highest</Typography>
                  <Typography fontFamily="Montserrat">Damage</Typography>
                  <Box sx={{ pb: .5 }}>
                    <ImgBox
                      sx={{ margin: 'auto' }}
                      width='75px'
                      height='75px'
                      src={getRoleIcon(mostStats.damage.item?.lobbyPosition!)}
                    />
                  </Box>
                  <Typography fontFamily="Montserrat">{mostStats.damage.item?.player.name}</Typography>
                  <Box>
                    <Typography fontFamily="Montserrat" variant='subtitle1' display='inline-block'>{mostStats.damage.limit}</Typography>
                    <Typography variant='caption' display='inline-block' fontStyle='italic' color={theme.palette.info.light} >/game</Typography>
                  </Box>
                </Box>
              </RisenBanner>

              <RisenBanner sx={{ width: topBannerWidth, backgroundColor: colors[3], color: 'white' }}>
                <Box sx={backgroundShading}>
                  <Typography fontFamily="Montserrat">Highest</Typography>
                  <Typography fontFamily="Montserrat">Vision</Typography>
                  <Box sx={{ pb: .5 }}>
                    <ImgBox
                      sx={{ margin: 'auto' }}
                      width='75px'
                      height='75px'
                      src={getRoleIcon(mostStats.visionScore.item?.lobbyPosition!)}
                    />
                  </Box>
                  <Typography fontFamily="Montserrat">{mostStats.visionScore.item?.player.name}</Typography>
                  <Box>
                    <Typography fontFamily="Montserrat" variant='subtitle1' display='inline-block'>{mostStats.visionScore.limit}</Typography>
                    <Typography variant='caption' display='inline-block' fontStyle='italic' color={theme.palette.info.light} >/game</Typography>
                  </Box>                </Box>
              </RisenBanner>

              <RisenBanner sx={{ width: topBannerWidth, backgroundColor: colors[4], color: 'white' }}>
                <Box sx={backgroundShading}>
                  <Typography fontFamily="Montserrat">Most</Typography>
                  <Typography fontFamily="Montserrat">Gold</Typography>
                  <Box sx={{ pb: .5 }}>
                    <ImgBox
                      sx={{ margin: 'auto' }}
                      width='75px'
                      height='75px'
                      src={getRoleIcon(mostStats.goldEarned.item?.lobbyPosition!)}
                    />
                  </Box>
                  <Typography fontFamily="Montserrat">{mostStats.goldEarned.item?.player.name}</Typography>
                  <Box>
                    <Typography fontFamily="Montserrat" variant='subtitle1' display='inline-block'>{mostStats.goldEarned.limit}</Typography>
                    <Typography variant='caption' display='inline-block' fontStyle='italic' color={theme.palette.info.light} >/game</Typography>
                  </Box>                
                </Box>
              </RisenBanner>
            </Box>

            {/*  */}
            <Box sx={{ pr: 4, pl: 4, pt: 2 }}>
              <Typography variant='h3' fontFamily='Montserrat'>Outstanding Games</Typography>
              {/* <Typography variant='h3' fontFamily='Montserrat'>Games</Typography> */}
              <hr />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', rowGap: 2, pt: 4, pb: 2, mr: 7, ml: 7, color: 'white', transform: 'scale(1.1)' }}>
              <BaseRisenBox title="Longest Game" subtitle={riotTimestampToGameTime(bestGames.longest.limit!)} sx={{ width: '350px', background: 'linear-gradient(0deg, rgba(24,38,143,1) 44%, rgba(30,30,30,1) 70%)' }}>
                <AllTeamInfo gameModel={bestGames.longest.item!} />
              </BaseRisenBox>
              <BaseRisenBox title="Fastest Game" subtitle={riotTimestampToGameTime(bestGames.shortest.limit!)} sx={{ width: '350px', background: 'linear-gradient(0deg, rgba(147,145,4,1) 44%, rgba(30,30,30,1) 70%)' }}>
                <AllTeamInfo gameModel={bestGames.shortest.item!} />
              </BaseRisenBox>
              <BaseRisenBox title="Bloodfest" subtitle={`${bestGames.mostKills.limit} kills`} sx={{ width: '350px', background: 'linear-gradient(0deg, rgba(162,27,27,1) 44%, rgb(30 30 30) 70%)' }}>
                <AllTeamInfo gameModel={bestGames.mostKills.item!} />
              </BaseRisenBox>
              <BaseRisenBox title="Herbivore" subtitle={`${bestGames.mostKills.limit} kills`} sx={{ width: '350px', background: 'linear-gradient(0deg, rgba(28,97,23,1) 44%, rgba(30,30,30,1) 70%)' }}>
                <AllTeamInfo gameModel={bestGames.leastKills.item!} />
              </BaseRisenBox>
            </Box>

            {/*  */}
            <Box sx={{ pr: 4, pl: 4, pt: 2 }}>
              <Typography variant='h3' fontFamily='Montserrat'>Best Performers</Typography>
              {/* <Typography variant='h3' fontFamily='Montserrat'>Players</Typography> */}
              <hr />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
              {/* <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <ImgBox
                  sx={{ mr: 1 }}
                  width='50px'
                  height='50px'
                  src={'/images/roles/BOTTOM.png'}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography fontFamily="Montserrat" variant='h5'>Earleking (10)</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <ImgBox
                  sx={{ mr: 1 }}
                  width='50px'
                  height='50px'
                  src={'/images/roles/BOTTOM.png'}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography fontFamily="Montserrat" variant='h5'>Earleking (10)</Typography>
                </Box>
              </Box> */}
              {
                groupedPlayerGameData && bestPlayers && (
                  <PlayerChampBanner {...mapBestPlayersToChampBanner(bestPlayers, groupedPlayerGameData)} />
                )
              }
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
              <Comparator highProps={{ name: 'Vexrax', value: '142', imgSrc: '/images/roles/SUPPORT.png' }} lowProps={{ name: 'Earleking', value: '2', imgSrc: '/images/roles/MIDDLE.png' }} title="Vision Score" titleWidth={200} />
            </Box> */}
          </Box>
        ) : null
      }
    </Container>
  );
}