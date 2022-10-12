import { useTheme } from "@emotion/react";
import { Theme, Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";
import PlayerModel from "../../../../../Common/models/player.model";
import RisenBox1 from "../../risen-box/risen-box-1";

interface Props {
  player?: PlayerModel;
}

export default function RankFlag({player}: Props)
{
  const theme = useTheme() as Theme;
  let league = player?.league ? player?.league : "Unranked";
  league = league[0].toUpperCase() + league.substring(1).toLocaleLowerCase();
  return (
    <RisenBox1 title="Rank">
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        {
          league === "Unranked" ? null :
          <Box sx={{height: 100, pr: 2, pl: 2}}>
            <img src={`/images/ranks/Emblem_${league}.png`} style={{height: '100%'}}></img>
          </Box>
        }
        <Box sx={{flexGrow: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Typography variant="h5" align="center" sx={{fontFamily: 'Montserrat'}}>{league} {player?.division}</Typography>
          {/* <Typography>Better than me</Typography> */}
        </Box>
      </Box>
    </RisenBox1>
  )
}