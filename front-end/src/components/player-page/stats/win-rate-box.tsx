import RisenBox1 from "../../risen-box/risen-box-1";
import {Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";
import {useTheme} from "@emotion/react";
import {Theme, Typography} from "@mui/material";
import "./win-rate-box.css"

interface WinRateBoxProps {
    wins: number;
    losses: number;
    hasData: boolean;
}

export default function WinRateBox(winRateProps: WinRateBoxProps) {
    const theme = useTheme() as Theme;

    // Fix this later lol
    const COLORS = [theme.palette.primary.dark, theme.palette.secondary.dark];

    const data = [{name: 'Wins', value: winRateProps.wins}, {name: 'Losses', value: winRateProps.losses}]
    const winRate = Math.round((winRateProps.wins / (winRateProps.wins + winRateProps.losses)) * 100)
    const winsOverLoss = `${winRateProps.wins + winRateProps.losses}G ${winRateProps.wins}G ${winRateProps.losses}L`

    return (
        <RisenBox1 sx={{minWidth: 280, minHeight: 280}}>
            <Typography color={theme.palette.info.light} variant="h4">Win Rate</Typography>
            {!winRateProps.hasData && <Typography color={theme.palette.info.light} variant="h3">No Data</Typography>}
            <PieChart width={240} height={200}>
                <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={90}
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
                        data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
                <Tooltip/>
            </PieChart>
        </RisenBox1>
    )
}