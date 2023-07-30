import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, FormGroup, Grid, Hidden, Popper, Tooltip, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import FilterBar from '../../components/filters/filter-bar';
import { GameRoles } from '../../../../Common/Interface/General/gameEnums';
import PlayerTierTable from '../../components/tables/player-tier';
import { GetActiveSeasons } from '../../api/season';
import SeasonModel from '../../../../Common/models/season.model';
import { TableColumn, LeaderboardType } from '../../common/types';
import { useNavigate } from 'react-router-dom';
import { toSearchName } from '../../../../Common/utils';
import BaseRisenBox from '../../components/risen-box/base-risen-box';
import { getAllHeadCells } from './leaderboardDef';
import { DEFAULT_RISEN_SEASON_ID } from '../../../../Common/constants';


export default function Leaderboards() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [seasonId, setSeasonId] = useState<string>(DEFAULT_RISEN_SEASON_ID);
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);
  const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);
  useEffect(() => {
    GetActiveSeasons().then(activeSeasons => {
      setSeasons(activeSeasons.seasons);
    });
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };


  const goToPlayer = (playerName: string) => {
    navigate(`/player/${toSearchName(playerName)}`);
  };

  const headCells = getAllHeadCells(goToPlayer);


  const [activeCells, setActiveCells] = useState<TableColumn<LeaderboardType>[]>(headCells.filter(cell => cell.active));
  const [modifiedCells, setModifiedCells] = useState<TableColumn<LeaderboardType>[]>(getAllHeadCells(goToPlayer));

  const open = Boolean(anchorEl);
  const id = open ? 'lb-col-edit' : undefined;

  const saveColumns = () => {
    setActiveCells(modifiedCells.filter(cell => cell.active));
    setAnchorEl(null);
  };

  const flipColumn = (i: number) => {
    setModifiedCells(modifiedCells.map((cell, j) => {
      if (i == j) {
        return {
          ...cell,
          active: !cell.active
        };
      }
      return cell;
    }));
  };

  const playerTierTable = useMemo(() => (
    <PlayerTierTable
      seasonId={seasonId}
      roleId={roleId}
      activeCols={activeCells} />
  ), [seasonId, roleId, activeCells]);

  return (
    <Container maxWidth='lg' sx={{ pt: 10, minHeight: '100vh', color: theme.palette.info.light }}>
      <Box>
        <Hidden mdDown>
          <Typography fontFamily="Montserrat" variant="h1" color={theme.palette.info.light}>
            TOP PLAYERS
          </Typography>
        </Hidden>
        <Hidden lgUp>
          <Typography fontFamily="Montserrat" variant="h3" color={theme.palette.info.light}>
            TOP PLAYERS
          </Typography>
        </Hidden>
      </Box>
      <hr />
      <FilterBar
        hideAllGames={true}
        seasonConfig={{ seasonId, setSeasonId, seasons }}
        roleConfig={{ roleId, setRoleId }} >
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box>
          <Button aria-describedby={id} onClick={handleEdit} variant='contained' sx={{ height: '80%', top: '10%' }}>
              Edit Columns
          </Button>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <BaseRisenBox sx={{ border: 1 }} title="Columns">
              <FormGroup>
                <Box sx={{ display: 'flex', columnGap: 1, rowGap: 2, flexWrap: 'wrap', maxWidth: '350px' }}>
                  {
                    modifiedCells.map((cell, i) => {
                      const label = cell.description ? (
                        <Tooltip title={cell.description}>
                          <Typography color={theme.palette.info.light}>{cell.label}</Typography>
                        </Tooltip>
                      ) : (
                        <Typography color={theme.palette.info.light}>{cell.label}</Typography>
                      );
                      return (
                        <FormControlLabel sx={{ width: '100px' }} control={<Checkbox checked={cell.active} onChange={() => flipColumn(i)} />} label={label} />
                      );
                    })
                  }
                </Box>
                <Box sx={{ display: 'flex', columnGap: 1 }}>
                  <Button variant='outlined' onClick={saveColumns}>Save</Button>
                  <Button variant='outlined' onClick={() => setAnchorEl(null)}>Cancel</Button>
                </Box>
              </FormGroup>
            </BaseRisenBox>
          </Popper>
        </Box>
      </FilterBar>
      {seasonId === 'RISEN' && <Typography variant="h5">SELECT A SEASON TO GET STARTED</Typography>}
      {seasonId !== 'RISEN' && playerTierTable}
    </Container>
  );
}