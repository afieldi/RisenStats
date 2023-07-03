import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';


export interface RoleSelectorProps {
    callBack: (event: SelectChangeEvent) => any
    initalValue?: GameRoles;
    sx?: SxProps<Theme>;
    imageSize: number;
    exclude? : GameRoles[]
}

export default function RoleSelector(props: RoleSelectorProps) {
  const currentValue = props.initalValue;
  const NoCheckRadio = <Radio icon={<Box sx={{ display: 'none' }} />} checkedIcon={<Box sx={{ width: '100%', height: '100%', position: 'absolute' }} />} disableRipple />;
  const excludedRoles = props.exclude ? props.exclude : [];

  const commonFilter = {
    flexGrow: 1,
    margin: 0,
    justifyContent: 'space-evenly',
    height: '50px',
  };
  const selectedFilter = {
    ...commonFilter,
    backgroundColor: 'rgb(255 255 255 / 11%)',
  };
  return (
    <FormControl sx={props.sx}>
      <RadioGroup
        id="role-simple-select"
        value={currentValue}
        sx={{ flexDirection: 'row' }}
        className="hide-radio"
        onChange={props.callBack}>
        {
          Object.keys(GameRoles)
            .filter(role => !excludedRoles.includes(role as GameRoles))
            .map((gameRole, index) => (
              <FormControlLabel
                value={gameRole}
                control={NoCheckRadio}
                disableTypography={true}
                sx={currentValue == gameRole ? selectedFilter : commonFilter}
                label={<img height={`${props.imageSize}px`} width={`${props.imageSize}px`} src={`/images/roles/${gameRole}.png`}></img>} />
            ))
        }

      </RadioGroup>
    </FormControl>
  );
}

