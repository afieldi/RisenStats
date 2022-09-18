import { styled } from '@mui/material/styles';
import React from "react";
import MuiDrawer from '@mui/material/Drawer';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import PhoneIcon from '@mui/icons-material/Phone';
import { Button, List, Theme } from '@mui/material';

import { DRAWER_WIDTH } from "../../common/constants";
import { useTheme } from "@emotion/react";

import theme from '../../styles/theme/darkTheme';

interface Props {
  open: boolean;
  onClose: () => void;
}

// I have no idea what any of this does. Do not touch
const openedMixin = (theme: any) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export function SideBar({ open, onClose }: Props) {

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    // @ts-ignore
    ({ open }) => ({
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader theme={theme}>
        {
          open ?
          <IconButton onClick={onClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton> : null
        }
      </DrawerHeader>
      <Divider />
      <List>
        {/* Home button */}
        <Link to="/">
          <ListItem button key="nav-home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>

        {/* League info */}
        <a href="http://risenesports.com/leagues">
          <ListItem button key="nav-home">
            <ListItemIcon>
              <GavelIcon />
            </ListItemIcon>
            <ListItemText primary={"League Info"} />
          </ListItem>
        </a>

        {/* Rules */}
        {/* <Link to="/info/rules">
          <ListItem button key="nav-home">
            <ListItemIcon>
              <GavelIcon />
            </ListItemIcon>
            <ListItemText primary={"Rules"} />
          </ListItem>
        </Link> */}

        {/* Contact */}
        <a href="http://risenesports.com/contact">
          <ListItem button key="nav-home">
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary={"Contact Us"} />
          </ListItem>
        </a>
      </List>

      {/* Admin manage */}
      {
        false ? (
        <Link to="/admin/codes">
          <ListItem button key="nav-home">
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary={"Manage Codes"} />
          </ListItem>
        </Link>
      ) : null
      }
      <Divider />
    </Drawer>
  )
}