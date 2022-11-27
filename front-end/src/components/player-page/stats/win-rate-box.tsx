import RisenBox1 from "../../risen-box/risen-box-1";
import {Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";
import {useTheme} from "@emotion/react";
import {Divider, Theme, Typography} from "@mui/material";
import "./win-rate-box.css"
import {calculateWR} from "../../../../../Common/utils";

interface WinRateBoxProps {
    wins: number;
    losses: number;
    hasData: boolean;
}

export default function WinRateBox(winRateProps: WinRateBoxProps) {
    const theme = useTheme() as Theme;

    const data = [  {name: 'Wins', value: winRateProps.wins, color: theme.palette.primary.dark},
                    {name: 'Losses', value: winRateProps.losses, color: theme.palette.secondary.dark}]
    const winRate = calculateWR({totalWins: winRateProps.wins, totalGames: winRateProps.wins + winRateProps.losses}, 1)
    const winsOverLoss = `${winRateProps.wins + winRateProps.losses}G ${winRateProps.wins}G ${winRateProps.losses}L`

    return (
        <RisenBox1 sx={{minWidth: 280, minHeight: 280}}>
            <Typography fontFamily="Montserrat" color={theme.palette.info.light} variant="h4">WIN RATE</Typography>
            {!winRateProps.hasData && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>}
            <PieChart width={240} height={200}>
                <Pie
                    data={data}
                    innerRadius={65}
                    outerRadius={95}
                    cx={'50%'}
                    cy={'50%'}
                    blendStroke={true}
                    dataKey={"value"}>
                    <Label value={winRate + "%"}
                           position="centerBottom"
                           className='label-top'
                           style={{ fill: theme.palette.info.dark, fontSize: '35px' }}/>
                    <Label value={winsOverLoss}
                           position="centerTop"
                           className='label'
                           style={{ fill: theme.palette.info.dark }}/>
                    {
                        data.map((entry, index) => <Cell key={index} fill={entry.color}/>)
                    }
                </Pie>
                <Tooltip/>
            </PieChart>
        </RisenBox1>
    )
}