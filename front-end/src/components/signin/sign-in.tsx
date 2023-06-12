import { Button } from '@mui/material';
import React from 'react';

export default function SignIn() {
  return (
    true == undefined ?
      <Button variant="contained" color="warning" onClick={() => {}}>Sign In</Button>
      : <Button variant="contained" color="warning" onClick={() => {}}>Sign Out</Button>
  );

}