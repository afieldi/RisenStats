import {Box, SxProps, Theme, Typography} from "@mui/material";
import React from "react";
import PlayerModel from "../../../../../Common/models/player.model";
import RisenBox1 from "../../risen-box/risen-box-1";

interface Props {
    player?: PlayerModel;
    sx?: SxProps<Theme> | undefined;
}

export default function RankFlag({player, sx}: Props) {
    let league = player?.league ? player?.league : "Unranked";
    league = league[0].toUpperCase() + league.substring(1).toLocaleLowerCase();
    return (
        <RisenBox1 title="Rank" sx={sx}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {
                    league === "Unranked" ? null :
                        <Box sx={{height: 100, pr: 2, pl: 2}}>
                            <img src={`/images/ranks/Emblem_${league}.png`} alt={"rank"} style={{height: '100%'}}/>
                        </Box>
                }
                <Box sx={{
                    flexGrow: 1,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Typography variant="h5" align="center"
                                sx={{fontFamily: 'Montserrat'}}>{league} {player?.division}</Typography>
                </Box>
            </Box>
        </RisenBox1>
    )
}