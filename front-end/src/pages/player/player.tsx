import { useTheme } from "@emotion/react";
import { Container, CssBaseline, Box, Typography, Tab, Tabs, Theme } from "@mui/material";
import PlayerPageHeader from "../../components/player-page/header";
import React from "react";
import { tabLabelProps, TabPanel } from "../../components/tab-panel/tab-panel";
import PlayerPageGeneral from "../../components/player-page/general";
import { RiotSummonerDto } from "../../../../Common/Interface/RiotAPI/RiotApiDto";
import GameModel from "../../../../Common/models/game.model";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetDetailedPlayerGames, GetPlayerGames, GetPlayerProfile } from "../../api/player";

import '../../styles/player.css'

interface Props {
  profile: RiotSummonerDto | null;
  error: number;
  // initalGames: GameModel[];
}

export async function getServerSideProps(context: any): Promise<{props: Props}>
{
  const {params} = context;
  const playerName: string = params.playerName;
  const res = await fetch(`/api/${playerName}/profile`);
  if (res.status !== 200)
  {
    return {
      props: {
        profile: null,
        error: 404,
        // initalGames: []
      }
    }
  }
  return {
    props: {
      profile: await res.json() as RiotSummonerDto,
      error: 0
    }
  }
  // const profile = await res.json() as RiotSummonerDto;

  // try
  // {
  //   const games = await LoadNextGames(playerName);
  //   return {
  //     props: {
  //       profile: profile,
  //       error: 0,
  //       initalGames: games
  //     }
  //   }
  // }
  // catch (e)
  // {
  //   return {
  //     props: {
  //       profile: profile,
  //       error: 500,
  //       initalGames: []
  //     }
  //   }
  // }
}

async function LoadNextGames(playerName: string, page=1, setGames: (value: any) => void)
{
  const profile = await GetPlayerProfile(playerName);
  const games = await GetDetailedPlayerGames(profile.overview.puuid);
  console.log(games)
  setGames(games.games);
}

function PlayerPage()
{
  let error = false;
  let { playerName } = useParams();
  const navigate = useNavigate();

  // if (error)
  // {
  //   // Why is this required, who knows. I just know that I need
  //   // this timeout or it causes an error
  //   setTimeout(() => {
  //     navigate("/error/player");
  //   }, 0);
  //   // Just return something so we don't error
  //   return (
  //     <Container>
  //       Oops
  //     </Container>
  //   )
  // }
  const [games, setGames] = useState([]);
  const theme = useTheme() as Theme;
  const [value, setValue] = React.useState(0);

  // useEffect(() => {
  //   console.log("Loading games");
  //   setGames([]);
  // }, [dynamicRoute]);
  useEffect(() => {
    console.log(`Getting data for ${playerName}`);
    setGames([]);
    if (playerName) {
      LoadNextGames(playerName, 1, setGames);
    }
  }, [])
  // LoadNextGames(profile!.name, 1, setGames);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth="md">
      <CssBaseline />
      <main>
      <Box
          sx={{
            pt: 15,
            pb: 6,
            bgcolor: theme.palette.background.paper
          }}
        >
          {/* @ts-ignore */}
          <PlayerPageHeader playerName={playerName}></PlayerPageHeader>
          <hr></hr>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs textColor="primary" indicatorColor="primary"  value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="General" {...tabLabelProps(0)} />
              <Tab label="Champions" {...tabLabelProps(1)} />
              <Tab label="Stats" {...tabLabelProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <PlayerPageGeneral games={games}></PlayerPageGeneral>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Twos
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Box>
      </main>
    </Container>
  );
}

// Not sure why, but doing this here seems to resolve a random error
// Sometimes it will say the default export for this file isn't a component
export default PlayerPage;