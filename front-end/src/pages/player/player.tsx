import { useTheme } from '@emotion/react';
import { Box, Container, CssBaseline, Tab, Tabs, Theme } from '@mui/material';
import { useAnimate } from 'framer-motion';
import PlayerPageHeader from '../../components/player-page/header';
import React from 'react';
import { TabPanel, tabLabelProps } from '../../components/tab-panel/tab-panel';
import PlayerPageGeneral from '../../components/player-page/general';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  GetDetailedPlayerGames,
  GetPlayerProfileByPlayerNameAndTagline,
  GetPlayerStats
} from '../../api/player';
import { PlayerDetailedGame, PlayerOverviewResponse } from '../../../../Common/Interface/Internal/player';

import '../../styles/player.css';
import AggregatedPlayerStatModel from '../../../../Common/models/aggregatedplayerstat.model';
import { ApiError } from '../../api/_call';
import PlayerPageChampions from '../../components/player-page/champions';
import SeasonModel from '../../../../Common/models/season.model';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import { getSeasonsForPlayer } from '../../api/season';
import PlayerPageStats from '../../components/player-page/stats';
import { getFlattenedLeaderboard } from '../../api/leaderboards';
import { DEFAULT_RISEN_SEASON_ID } from '../../../../Common/constants';

function PlayerPage() {
  let { playerNameWithTagline } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [games, setGames] = useState<PlayerDetailedGame[]>([]);
  const [page, setPage] = useState(1);
  const theme = useTheme() as Theme;
  const [value, setValue] = React.useState(0);
  const [loadingGames, setLoadingGames] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerOverviewResponse>();
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);
  const [playerStats, setPlayerStats] = useState<AggregatedPlayerStatModel[]>([]);
  const [fullLeaderboard, setFullLeaderboard] = useState<Map<string, Map<GameRoles, AggregatedPlayerStatModel[]>>>(new Map<string, Map<GameRoles, AggregatedPlayerStatModel[]>>());
  const [seasonId, setSeasonId] = useState<string>(DEFAULT_RISEN_SEASON_ID);
  const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);
  const [scope, animate] = useAnimate();

  async function loadPlayerProfile() {
    if (playerNameWithTagline) {
      try {
        const profile = await GetPlayerProfileByPlayerNameAndTagline(playerNameWithTagline);
        setPlayerProfile(profile);
        return profile;
      } catch (error) {
        console.log(error);
      }
    }
    throw new Error('No Player found');
  }

  async function loadMoreGames(newPlayer = false, profile?: PlayerOverviewResponse | undefined) {
    profile = profile ? profile : playerProfile;
    if (profile) {
      setLoadingGames(true);
      const tmpPage = newPlayer ? 1 : page;
      try {
        const newGames = await GetDetailedPlayerGames(profile.overview.puuid, tmpPage, 10, seasonId, roleId);
        if (newPlayer) {
          setGames(newGames.games);
        } else {
          setGames(games.concat(newGames.games));
        }
        setPage(tmpPage + 1);
        setLoadingGames(false);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          navigate('/404');
        }
      }
    }
  }

  async function loadLeaderboards() {
    if (seasonId === 'ALL' || seasonId === DEFAULT_RISEN_SEASON_ID) {
      return;
    }

    try {
      let cachedLeaderboard: Map<string, Map<GameRoles, AggregatedPlayerStatModel[]>> = new Map<string, Map<GameRoles, AggregatedPlayerStatModel[]>>(fullLeaderboard); // Need to create new object to trigger rerender

      let roleMaps: Map<GameRoles, AggregatedPlayerStatModel[]> = !cachedLeaderboard.has(seasonId) ? new Map<GameRoles, AggregatedPlayerStatModel[]>() : cachedLeaderboard.get(seasonId) as Map<GameRoles, AggregatedPlayerStatModel[]>;
      if (roleMaps.has(roleId)) {
        return;
      }

      console.log('Reloading leaderboards from API');

      const stats = await getFlattenedLeaderboard(Number(seasonId), roleId);
      roleMaps.set(roleId, stats);
      cachedLeaderboard.set(seasonId, roleMaps);
      setFullLeaderboard(cachedLeaderboard);
    } catch (error) {
      console.error('An error occured while trying to load leaderboards');
    }
  }

  async function loadPlayerStats(profile: PlayerOverviewResponse | undefined) {
    profile = profile ? profile : playerProfile;
    if (!profile) {
      console.log('Tried to call loadPlayerStats with a null profile');
      return;
    }
    try {
      let numberSeasonId = seasonId === 'RISEN' ? undefined : Number(seasonId);
      let teamId = undefined; // TODO hook this in to some component
      let championId = undefined; // TODO hook this in to some component
      const stats = await GetPlayerStats(profile.overview.puuid, numberSeasonId, roleId, teamId, championId, seasonId === 'RISEN');

      setPlayerStats(stats.playerStats);
    } catch (error) {
      console.error('An error occured while trying to load player stats');
    }
  }

  async function loadSeasons(playerPuuid: string) {
    try {
      setSeasons((await getSeasonsForPlayer(playerPuuid)).seasons);
    } catch (error) {
      console.log(error);
    }
  }

  function onUpdatePlayer() {
    // When a player reloads thier profile, reset all the cached leaderboards and reget from API
    setFullLeaderboard(new Map<string, Map<GameRoles, AggregatedPlayerStatModel[]>>());
    loadLeaderboards();
  }

  useEffect(() => {
    loadPlayerProfile().then(profile => {
      setPlayerProfile(profile);
      loadMoreGames(true, profile);
      loadPlayerStats(profile);
      loadSeasons(profile.overview.puuid);
      setSeasonId(DEFAULT_RISEN_SEASON_ID);
      loadLeaderboards();
    }, (err: any) => {
      console.log(err);
    });
  }, [location]);

  useEffect(() => {
    loadMoreGames(true);
    loadPlayerStats(playerProfile);
    loadLeaderboards();
  }, [seasonId, roleId]);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    loadLeaderboards();
    setValue(newValue);
  };

  const loadGamesConfig = {
    callback: loadMoreGames,
    status: loadingGames,
    seasonConfig: {
      seasonId,
      setSeasonId,
    },
    roleConfig: {
      roleId,
      setRoleId,
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh' }}>
      <CssBaseline/>
      <main>
        <Box
          sx={{
            pt: 15,
            pb: 6,
          }}
          ref={scope}
        >
          <PlayerPageHeader playerOverview={playerProfile} onUpdate={onUpdatePlayer}/>
          <hr></hr>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs textColor="primary" indicatorColor="primary" value={value} onChange={handleChange}
              aria-label="basic tabs example">
              <Tab label="General" {...tabLabelProps(0)} />
              <Tab label="Champions" {...tabLabelProps(1)} />
              <Tab label="Stats" {...tabLabelProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <PlayerPageGeneral player={playerProfile?.overview}
              playerStats={playerStats}
              seasons={seasons}
              games={games}
              loadGamesConfig={loadGamesConfig}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PlayerPageChampions playerStats={playerStats}
              seasonConfig={{
                ...loadGamesConfig.seasonConfig,
                seasons: seasons.filter(season => season.active)
              }}
              roleConfig={loadGamesConfig.roleConfig}/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PlayerPageStats playerStatsByChampionAndRole={playerStats}
              playerPuuid={playerProfile?.overview.puuid}
              leaderboardData={fullLeaderboard.get(seasonId)?.get(roleId)}
              seasonConfig={{
                ...loadGamesConfig.seasonConfig,
                seasons: seasons.filter(season => season.active)
              }}
              roleConfig={loadGamesConfig.roleConfig}/>
          </TabPanel>
        </Box>
      </main>
    </Container>
  );
}

// Not sure why, but doing this here seems to resolve a random error
// Sometimes it will say the default export for this file isn't a component
export default PlayerPage;