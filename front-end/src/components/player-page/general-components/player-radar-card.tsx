import {Box, SxProps, Theme} from "@mui/material";
import React from "react";
import {PlayerDetailedGame} from "../../../../../Common/Interface/Internal/player";
import RisenBox1 from "../../risen-box/risen-box-1";
import PlayerRadar from "./player-radar";

interface Props {
    sx?: SxProps<Theme> | undefined;
    games: PlayerDetailedGame[];
}

export default function PlayerRadarCard({sx, games}: Props) {
    const options = {
        height: 300,
        width: 300
    }
    return (
        <RisenBox1 sx={sx} title="Performance">
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <PlayerRadar games={games} sx={sx} options={options}></PlayerRadar>
            </Box>
        </RisenBox1>
    );
}