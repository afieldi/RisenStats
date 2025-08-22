import LoginIcon from '@mui/icons-material/Login';
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect } from 'react';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import PhoneIcon from '@mui/icons-material/Phone';
import DrawIcon from '@mui/icons-material/Draw';
import PersonIcon from '@mui/icons-material/Person';
import { List } from '@mui/material';
import Cookies from 'universal-cookie';

import { AUTH_COOKIE_KEY, DRAWER_WIDTH, OAUTH_URL } from '../../common/constants';

import theme from '../../styles/theme/darkTheme';
import { Leaderboard, Logout } from '@mui/icons-material';
import { AuthenticationContext, canManageCodes, isLoggedIn } from '../authentication/authentication';
import SideBarLinkItem from './side-bar-link-item';

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
  const user = useContext(AuthenticationContext);
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
        <SideBarLinkItem  isInternalLink={true}
          url={'/'}
          key={'nav-home'}
          primaryText={'Home'}>
          <HomeIcon/>
        </SideBarLinkItem>

        <SideBarLinkItem  isInternalLink={true}
          url={'/search'}
          key={'nav-search'}
          primaryText={'Player Stats'}>
          <PersonIcon/>
        </SideBarLinkItem>

        <SideBarLinkItem  isInternalLink={true}
          url={'/leaderboard'}
          key={'nav-leaderboard'}
          primaryText={'Stats Leaderboards'}>
          <Leaderboard/>
        </SideBarLinkItem>

        <SideBarLinkItem  isInternalLink={false}
          url={'http://risenesports.com/leagues'}
          key={'nav-league'}
          primaryText={'League Info'}>
          <GavelIcon/>
        </SideBarLinkItem>

        <SideBarLinkItem isInternalLink={false}
          url={'/drafting'}
          key={'nav-draft'}
          primaryText={'Draft Tool'}>
          <DrawIcon/>
        </SideBarLinkItem>

        <SideBarLinkItem isInternalLink={false}
          url={'http://risenesports.com/contact'}
          key={'nav-contact'}
          primaryText={'Contact Us'}>
          <PhoneIcon/>
        </SideBarLinkItem>

        {isLoggedIn(user) ? <SideBarLinkItem
          isInternalLink={false}
          url={'#'}
          onClick={() => {(new Cookies()).remove(AUTH_COOKIE_KEY); window.location.reload();}}
          key={'nav-logout'}
          primaryText={'Log Out'}
        >
          <Logout/>
        </SideBarLinkItem> : <SideBarLinkItem
          isInternalLink={false}
          url={OAUTH_URL}
          key={'nav-login'}
          primaryText={'Log In'}
        >
          <LoginIcon/>
        </SideBarLinkItem>}
      </List>

      {
        canManageCodes(user) ? (
          <SideBarLinkItem isInternalLink={true}
            url={'/admin/codes'}
            key={'nav-admin'}
            primaryText={'Manage Codes'}>
            <PhoneIcon />
          </SideBarLinkItem>
        ) : null
      }
      <Divider />
    </Drawer>
  );
}