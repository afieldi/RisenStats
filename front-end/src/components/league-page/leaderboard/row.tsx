import React from 'react';
import { Box } from '@mui/system';
import { getGradient } from '../../../common/utils';
import { Theme, Typography } from '@mui/material';
import ImgBox from '../../risen-box/img-box';

export interface LeaderboardRowProps {
    gamesElement: React.ReactNode,
    identifierElement: React.ReactNode,
    mainValueElement: React.ReactNode,
}

export interface RowMainValue {
  value: number,
  formatter: (value: number) => string
}
export function Row(bgColor: string, nameTypography: React.ReactNode, gamesTypography: React.ReactNode, mainValueTypography: React.ReactNode) {
  return (
    <Box sx={{ pt: 0.5, pb: 0.5, display: 'flex', flexDirection: 'row', justifyContent:'space-between', background: getGradient(bgColor) }}>
      {nameTypography}
      <Box sx={{ minWidth: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {gamesTypography}
        {mainValueTypography}
      </Box>
    </Box>
  );
}

export function buildTextBasedLeaderboardRowProps(identifier: string, games: string, mainValue: RowMainValue, theme: Theme, mainValueColorChooser: (value: number, theme: Theme) => string): LeaderboardRowProps {
  const identifierTypography = <Typography sx={{ paddingLeft: 2 }} fontWeight="bold" variant='body2' align='left'>{identifier}</Typography>;
  const gamesTypography= <Typography sx={{ minWidth: 80 }} variant='body2' align='center' color={theme.palette.info.main}>{games}</Typography>;
  const mainValueElement = <Typography sx={{ minWidth: 60, paddingRight: 1 }} fontWeight="bold" variant='body2' align='center' color={mainValueColorChooser(mainValue.value, theme)}>{mainValue.formatter(mainValue.value)}</Typography>;
  return {
    gamesElement: gamesTypography,
    identifierElement: identifierTypography,
    mainValueElement: mainValueElement
  };
}

export function buildTextBasedLeaderboardRowPropsWithRedirect(identifier: string,
  games: string,
  mainValue: RowMainValue,
  theme: Theme,
  mainValueColorChooser: (value: number, theme: Theme) => string,
  onClick: () => void): LeaderboardRowProps {

  const identifierTypography = <Typography sx={{ paddingLeft: 2, '&:hover': { color: theme.palette.hoverTeam.main, cursor: 'pointer' } }} fontWeight="bold" variant='body2' align='left' onClick={onClick}>{identifier}</Typography>;
  const gamesTypography= <Typography sx={{ minWidth: 80 }} variant='body2' align='center' color={theme.palette.info.main}>{games}</Typography>;
  const mainValueElement = <Typography sx={{ minWidth: 60, paddingRight: 1  }} fontWeight="bold" variant='body2' align='center' color={mainValueColorChooser(mainValue.value, theme)}>{mainValue.formatter(mainValue.value)}</Typography>;
  return {
    gamesElement: gamesTypography,
    identifierElement: identifierTypography,
    mainValueElement: mainValueElement
  };
}

export function buildImageBasedLeaderboardRowProps(src: string, alt: string, games: number, mainValue: RowMainValue, theme: Theme, mainValueColorChooser: (value: number, theme: Theme) => string): LeaderboardRowProps {
  const identifierImg = <ImgBox
    sx={{ height:25, width: 25, pl:2 }}
    alt={alt}
    src={src}
    height="25px"
    width="25px"
  />;
  const gamesTypography= <Typography sx={{ minWidth: 80 }} variant='body2' align='center' color={theme.palette.info.main}>{games}</Typography>;
  const mainValueElement = <Typography sx={{ minWidth: 60, paddingRight: 1 }} fontWeight="bold" variant='body2' align='center' color={mainValueColorChooser(mainValue.value, theme)}>{mainValue.formatter(mainValue.value)}</Typography>;
  return {
    gamesElement: gamesTypography,
    identifierElement: identifierImg,
    mainValueElement: mainValueElement
  };
}

export function buildTextBasedLeaderboardHeader(identifierTitle: string, gamesTitle: string, mainValueTitle: string, theme: Theme): LeaderboardRowProps {
  const identifierHeader = <Typography sx={{ paddingLeft: 2 }} variant='subtitle2' align='left' color={theme.palette.info.main}>{identifierTitle}</Typography>;
  const gamesHeader= <Typography sx={{ minWidth: 60 }} variant='subtitle2' align='left' color={theme.palette.info.main}>{gamesTitle}</Typography>;
  const mainValueHeader = <Typography sx={{ minWidth: 60, paddingRight: 1 }} variant='subtitle2' align='left' color={theme.palette.info.main}>{mainValueTitle}</Typography>;
  return {
    gamesElement: gamesHeader,
    identifierElement: identifierHeader,
    mainValueElement: mainValueHeader
  };
}