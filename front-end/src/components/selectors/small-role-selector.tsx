import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';

import React from 'react';
import { RoleSelectorProps } from './role-selector';

export default function SmallRoleSelector(props: RoleSelectorProps) {
  const currentValue = props.initalValue;
  const NoCheckRadio = <Radio icon={<Box sx={{ display: 'none' }} />} checkedIcon={<Box sx={{ width: '100%', height: '100%', position: 'absolute' }} />} disableRipple />;
  const excludedRoles = props.exclude ? props.exclude : [];

  const notSelected = {
    flexGrow: 1,
    margin: 0,
    justifyContent: 'space-evenly',
    height: '50px',
    filter: 'grayscale(100%)'
  };
  const selectedFilter = {
    ...notSelected,
    filter: 'grayscale(0%)'
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
                sx={currentValue == gameRole ? selectedFilter : notSelected}
                label={<img height={`${props.imageSize}px`} width={`${props.imageSize}px`} src={`/images/roles/${gameRole}.png`}></img>} />
            ))
        }
      </RadioGroup>
    </FormControl>
  );
}