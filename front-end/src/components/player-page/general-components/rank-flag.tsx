import { useTheme } from "@emotion/react";
import { Theme, Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";
import RisenBox1 from "../../risen-box/risen-box-1";

interface Props {
  rank: string;
}

export default function RankFlag({rank}: Props)
{
  const theme = useTheme() as Theme;
  return (
    <RisenBox1 sx={{display: 'flex'}}>
      <Box sx={{height: 75, pr: 2}}>
        <img src="https://static.wikia.nocookie.net/leagueoflegends/images/5/5f/Season_2019_-_Challenger_1.png" style={{height: '100%'}}></img>
      </Box>
      <Box sx={{flexGrow: 1}}>
        <Typography variant="h6">Platinum 3</Typography>
        <Typography>Better than me</Typography>
      </Box>
    </RisenBox1>
  )
}