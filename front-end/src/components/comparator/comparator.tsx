import { Box, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import ImgBox from '../risen-box/img-box';

interface SingleItemProps {
  imgSrc: string;
  name: string;
  value?: string;
  borderColor?: string;
}

interface ComparatorProps {
  highProps: SingleItemProps;
  lowProps: SingleItemProps;
  title?: string;
  titleWidth?: string | number;
  sx?: SxProps<Theme>;
}

function singleItem(props: SingleItemProps, sx?: SxProps<Theme>) {
  const {
    imgSrc,
    name,
    value,
    borderColor,
  } = props;
  return (
    <Box sx={{ ...sx, display: 'flex', flexGrow: '0', columnGap: 1, width: 200, justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h6' fontFamily="Montserrat">{name}</Typography>
        {
          value && <Typography variant='subtitle2' fontFamily="Montserrat" sx={{ textAlign: 'end' }}>{value}</Typography>
        }
      </Box>
      <Box>
        <ImgBox
          sx={{ margin: 'auto', boxSizing: 'border-box' }}
          width='65px'
          height='65px'
          src={imgSrc}
        />
      </Box>
    </Box>
  );
}


export default function Comparator({ highProps, lowProps, title, titleWidth }: ComparatorProps) {

  return (
    <Box sx={{ display: 'flex' }}>
      { singleItem({ borderColor: 'blue', ...highProps }) }
      {
        title && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: 3, pl: 2, width: titleWidth }}>
            <Typography variant='h5' fontFamily="Montserrat">{title}</Typography>
          </Box>
        )
      }
      { singleItem({ borderColor: 'red', ...lowProps }, { direction: 'rtl' }) }
    </Box>
  );
}