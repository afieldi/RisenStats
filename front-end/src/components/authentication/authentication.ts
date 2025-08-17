import React from 'react';

export interface AuthenticationInterface {
  user: string;
  auth: string;
  level: number;
  name: string;
}

export const DEFAULT_USER = {
  user: '',
  auth: '',
  level: -1,
  name: '',
};

export const AuthenticationContext = React.createContext<AuthenticationInterface>(DEFAULT_USER);

export const isLoggedIn = (user: AuthenticationInterface) => user.level > 0;
export const isAdmin = (user: AuthenticationInterface) => isLoggedIn(user) && user.level < 2;
export const canManageCodes = (user: AuthenticationInterface) => user.level < 5;