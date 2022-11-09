import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import React from "react";
import SeasonModel from "../../../../Common/models/season.model";

export interface RisenSeasonSelectorProps {
    callBack: (event: SelectChangeEvent) => any
    sx?: SxProps<Theme>
    seasonConfig?: {
        seasonId: string,
        setSeasonId: (seasonId: string) => void,
        seasons?: SeasonModel[],
    };
    hideAllGames: boolean
}

export default function RisenSeasonSelector(props: RisenSeasonSelectorProps) {
    return (
        <FormControl sx={props.sx}>
            <InputLabel id="season-filter-select-label">Season</InputLabel>
            <Select
                labelId="season-filter-select-label"
                id="season-simple-select"
                value={props.seasonConfig?.seasonId}
                label="Season"
                onChange={props.callBack}
            >
                {!props.hideAllGames && <MenuItem value="ALL">All Tournament Games</MenuItem>}

                <MenuItem value="RISEN">All Risen Games</MenuItem>

                {
                    props.seasonConfig?.seasons?.map((season, index) => (
                        <MenuItem key={index} value={season.id}>{season.seasonName}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}