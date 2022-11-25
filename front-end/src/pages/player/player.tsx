import { useTheme } from "@emotion/react";
import { Container, CssBaseline, Box, Typography, Tab, Tabs, Theme } from "@mui/material";
import PlayerPageHeader from "../../components/player-page/header";
import React from "react";
import { tabLabelProps, TabPanel } from "../../components/tab-panel/tab-panel";
import PlayerPageGeneral from "../../components/player-page/general";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {GetDetailedPlayerGames, GetPlayerChampionStats, GetPlayerProfile, GetPlayerStats} from "../../api/player";
import { PlayerDetailedGame, PlayerOverviewResponse } from "../../../../Common/Interface/Internal/player";

import '../../styles/player.css'
import { ApiError } from "../../api/_call";
import PlayerPageChampions from "../../components/player-page/champions";
import PlayerChampionStatsModel from "../../../../Common/models/playerchampionstats.model";
import SeasonModel from "../../../../Common/models/season.model";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import { GetActiveSeasons } from "../../api/season";
import PlayerPageStats from "../../components/player-page/stats";
import PlayerStatModel from "../../../../Common/models/playerstat.model";
import {getFlattenedLeaderboard} from "../../api/leaderboards";

function PlayerPage()
{
  let { playerName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [games, setGames] = useState<PlayerDetailedGame[]>([]);
  const [page, setPage] = useState(1);
  const theme = useTheme() as Theme;
  const [value, setValue] = React.useState(0);
  const [loadingGames, setLoadingGames] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerOverviewResponse>();
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);
  const [championStats, setChampionStats] = useState<PlayerChampionStatsModel[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStatModel[]>([]);
  const [fullLeaderboard, setFullLeaderboard] = useState<Map<string, Map<GameRoles, PlayerStatModel[]>>>(new Map<string, Map<GameRoles, PlayerStatModel[]>>());
  const [seasonId, setSeasonId] = useState<string>("RISEN");
  const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);

  async function loadPlayerProfile() {
    if (playerName) {
      try {
        const profile = await GetPlayerProfile(playerName);
        setPlayerProfile(profile);
        return profile;
      }
      catch (error) {
        console.log(error);
      }
    }
    throw new Error("No Player found");
  }

  async function loadMoreGames(newPlayer=false, profile?: PlayerOverviewResponse | undefined) {
    profile = profile ? profile : playerProfile;
    if (profile) {
      setLoadingGames(true);
      const tmpPage = newPlayer ? 1 : page;
      try {
        const newGames = await GetDetailedPlayerGames(profile.overview.puuid, tmpPage, 10, seasonId, roleId);
        if (newPlayer) {
          setGames(newGames.games);
        }
        else {
          setGames(games.concat(newGames.games));
        }
        setPage(tmpPage+1);
        setLoadingGames(false);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          navigate('/404');
        }
      }
    }
  }

  async function loadLeaderboards() {
    if (seasonId === "ALL" || seasonId === "RISEN") {
      return;
    }
    try {
      let cachedLeaderboard: Map<string, Map<GameRoles, PlayerStatModel[]>> = new Map<string, Map<GameRoles, PlayerStatModel[]>>(fullLeaderboard); // Need to create new object to trigger rerender
      let numberSeasonId = seasonId === "RISEN" ? undefined : Number(seasonId)

      let roleMaps: Map<GameRoles, PlayerStatModel[]> = !cachedLeaderboard.has(seasonId) ? new Map<GameRoles, PlayerStatModel[]>() : cachedLeaderboard.get(seasonId) as Map<GameRoles, PlayerStatModel[]>
      if (roleMaps.has(roleId)) {
        return;
      }

      const stats = await getFlattenedLeaderboard(numberSeasonId,seasonId === "RISEN",  roleId);
      roleMaps.set(roleId, stats);
      cachedLeaderboard.set(seasonId, roleMaps);
      setFullLeaderboard(cachedLeaderboard);

    }
    catch (error) {
      console.error("An error occured while trying to load leaderboards")
    }
  }

  async function loadChampionStats(profile: PlayerOverviewResponse | undefined) {
    profile = profile ? profile : playerProfile
    if (profile) {
      // setLoadingGames(true);
      try {
        const stats = await GetPlayerChampionStats(profile.overview.puuid, Number(seasonId), seasonId === "RISEN", roleId);
        stats.champions.sort((a, b) => b.totalGames - a.totalGames);
        setChampionStats(stats.champions);
      }
      catch (error) {

      }
    }
  }

  async function loadPlayerStats(profile: PlayerOverviewResponse | undefined) {
    profile = profile ? profile : playerProfile
    if(!profile) {
      console.log("Tried to call loadPlayerStats with a null profile")
      return;
    }
    try {
      let numberSeasonId = seasonId === "RISEN" ? undefined : Number(seasonId)
      const stats = await GetPlayerStats(profile.overview.puuid, numberSeasonId, roleId, seasonId === "RISEN");
      setPlayerStats(stats.playerStats);
    }
    catch (error) {
      console.error("An error occured while trying to load player stats")
    }
  }

  async function loadSeasons() {
    try {
      setSeasons((await GetActiveSeasons()).seasons);
    } catch (error) {
      console.log(error);
    }
  }

  function onUpdatePlayer() {
    // When a player reloads thier profile, reset all the cached leaderboards and reget from API
    setFullLeaderboard(new Map<string, Map<GameRoles, PlayerStatModel[]>>())
    loadLeaderboards();
  }

  useEffect(() => {
    loadPlayerProfile().then(profile => {
      setPlayerProfile(profile)
      loadMoreGames(true, profile);
      loadChampionStats(profile);
      loadPlayerStats(profile);
      loadLeaderboards()
    }, (err: any) => {
      console.log(err);
    });
  }, [location]);

  useEffect(() => {
    loadMoreGames(true);
    loadPlayerStats(playerProfile);
    loadChampionStats(playerProfile);
    loadLeaderboards()
  }, [seasonId, roleId]);

  useEffect(() => {
    loadSeasons();
  }, []);


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
    <Container maxWidth="lg" sx={{minHeight: '100vh'}}>
      <CssBaseline />
      <main>
      <Box
          sx={{
            pt: 15,
            pb: 6,
          }}
        >
          <PlayerPageHeader playerOverview={playerProfile} onUpdate={onUpdatePlayer}/>
          <hr></hr>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs textColor="primary" indicatorColor="primary"  value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="General" {...tabLabelProps(0)} />
              <Tab label="Champions" {...tabLabelProps(1)} />
              <Tab label="Stats" {...tabLabelProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <PlayerPageGeneral player={playerProfile?.overview} seasons={seasons} games={games} loadGamesConfig={loadGamesConfig}></PlayerPageGeneral>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PlayerPageChampions championData={championStats}
                                 seasonConfig={{...loadGamesConfig.seasonConfig, seasons}}
                                 roleConfig={loadGamesConfig.roleConfig}/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PlayerPageStats playerStats={playerStats}
                             playerPuuid={playerProfile?.overview.puuid}
                             leaderboardData={fullLeaderboard.get(seasonId)?.get(roleId)}
                             seasonConfig={{...loadGamesConfig.seasonConfig, seasons}}
                             roleConfig={loadGamesConfig.roleConfig}
                             championData={championStats}/>
          </TabPanel>
        </Box>
      </main>
    </Container>
  );
}

// Not sure why, but doing this here seems to resolve a random error
// Sometimes it will say the default export for this file isn't a component
export default PlayerPage;