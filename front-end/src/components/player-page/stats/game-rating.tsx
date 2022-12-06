import {useTheme} from "@emotion/react";
import {Box, Divider, Theme, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import {Rank} from "./game-rating-overview";

interface GameRatingProps {
    title: string,
    rating: string,
    rank: Rank;
}

export default function GameRating(props: GameRatingProps) {
    const theme = useTheme() as Theme;

    const colorMap: Record<Rank, string> = {
        "S+": theme.palette.primary.light,
        S: theme.palette.primary.dark,
        A: theme.palette.first.main,
        B: theme.palette.second.main,
        C: theme.palette.third.main,
        D: theme.palette.info.light,
    }

    return (
        <Box sx={{maxWidth: 280, display: 'flex', flexDirection: 'column', rowGap: 2}}>
            <RisenBox1 sx={{minWidth: 230}}>
                <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="subtitle1">{props.title}</Typography>
                <Divider sx={{marginBottom: 2}}/>
                <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 1, justifyContent: "space-between", alignContent: "center"}}>
                    <Typography sx={{paddingTop: "10px"}} color={theme.palette.info.light} align="center" variant="h6">{props.rating}</Typography>
                    <Typography  color={colorMap[props.rank]} align="center" variant="h3">{props.rank}</Typography>
                </Box>
            </RisenBox1>
        </Box>
    );
}
