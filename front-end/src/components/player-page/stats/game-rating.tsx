import {useTheme} from "@emotion/react";
import {Box, Divider, Theme, Tooltip, Typography} from "@mui/material";
import RisenBox1 from "../../risen-box/risen-box-1";
import React from "react";
import {Rank} from "./game-rating-overview";

interface GameRatingProps {
    hasData: boolean;
    title: string,
    tooltip: String,
    rating: string,
    rank: Rank;
}

export default function GameRating(props: GameRatingProps) {
    const theme = useTheme() as Theme;

    const colorMap: Record<Rank, string> = {
        "S+": theme.palette.secondary.light,
        S: theme.palette.primary.dark,
        A: theme.palette.first.main,
        B: theme.palette.second.main,
        C: theme.palette.third.main,
        D: theme.palette.info.light,
    }

    return (
        <Box sx={{maxWidth: 270, display: 'flex', flexDirection: 'column', rowGap: 2}}>
            <RisenBox1 sx={{minWidth: 230}}>
                <Tooltip title={props.tooltip}>
                    <Typography fontFamily="Montserrat" color={theme.palette.info.light} align="left" variant="subtitle2">{props.title.toUpperCase()}</Typography>
                </Tooltip>
                <Divider sx={{marginBottom: 2}}/>
                { !props.hasData &&
                    <Typography sx={{paddingTop: "10px"}} color={theme.palette.info.light} align="center" variant="h6">No Data</Typography>
                }
                { props.hasData &&
                    <Box sx={{display: 'flex', flexDirection: 'row', columnGap: 1, justifyContent: "space-between", alignContent: "center"}}>
                        <Typography color={theme.palette.info.light} align="left" variant="h6">{props.rating}</Typography>
                        <Typography color={colorMap[props.rank]} align="left" variant="h5">{props.rank}</Typography>
                    </Box>
                }
            </RisenBox1>
        </Box>
    );
}
