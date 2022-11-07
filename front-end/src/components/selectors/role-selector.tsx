import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {GameRoles} from "../../../../Common/Interface/General/gameEnums";
import React from "react";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";


export interface RoleSelectorProps {
    callBack: (event: SelectChangeEvent) => any
    initalValue?: GameRoles;
    sx?: SxProps<Theme>
}

export default function RoleSelector(props: RoleSelectorProps) {
    return (
        <FormControl sx={props.sx}>
            <InputLabel id="role-filter-select-label">Role</InputLabel>
            <Select
                labelId="role-filter-select-label"
                id="role-simple-select"
                value={props.initalValue}
                label="Role"
                onChange={props.callBack}
            >
                {
                    Object.keys(GameRoles).map((gameRole, index) => (
                        <MenuItem key={index} value={gameRole}>{gameRole}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}

