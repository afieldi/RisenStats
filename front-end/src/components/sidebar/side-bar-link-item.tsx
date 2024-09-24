import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

interface Props {
    isInternalLink: boolean
    url: string,
    key: string,
    primaryText: string;
    onClick?: () => void;
    children: React.ReactNode; // should always be a svg icon
}

export default function SideBarLinkItem(props: Props) {
  if (props.isInternalLink && !props.onClick) {
    return (
      <Link to={props.url}>
        {getListItem(props.key, props.primaryText, props.children)}
      </Link>
    );
  } else {
    return (
      <a href={props.url} onClick={props.onClick}>
        {getListItem(props.key, props.primaryText, props.children)}
      </a>
    );
  }
}

function getListItem(key: string, primaryText: string, icon: React.ReactNode) {
  return (
    <ListItem button key={key}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={primaryText} />
    </ListItem>
  );
}

