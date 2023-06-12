import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles'
{
  interface PaletteOptions {
    risenBoxBg: PaletteOptions['primary'];
    risenVictory: PaletteOptions['primary'];
    risenDefeat: PaletteOptions['primary'];
    first: PaletteOptions['primary'];
    second: PaletteOptions['primary'];
    third: PaletteOptions['primary'];
    nth: PaletteOptions['primary'];
    tertiary: PaletteOptions['primary'];
    websiteBackground: PaletteOptions['primary'];
  }

  interface Palette {
    risenBoxBg: Palette['primary'];
    risenVictory: Palette['primary'];
    risenDefeat: Palette['primary'];
    first: Palette['primary'];
    second: Palette['primary'];
    third: Palette['primary'];
    nth: Palette['primary'];
    tertiary: Palette['primary'];
    websiteBackground: Palette['primary'];
  }

  interface TypeBackground {
    highlight: string
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    risenBoxBg: {
      main: '#1e1e1e'
    },
    risenVictory: {
      main: '#0e304d'
    },
    risenDefeat: {
      main: '#4b2222'
    },
    first: {
      main: '#FFA500',
    },
    second: {
      main: '#85BCBF',
    },
    third: {
      main: '#834B24',
    },
    nth: {
      main: '#565554',
    },
    primary: {
      main: '#f45f00',
      dark: '#53270d'
    },
    secondary: {
      main: '#072f73',
      dark: '#000B20'
    },
    info: {
      main: '#a3a3a3'
    },
    tertiary: {
      main: '#214E34'
    },
    websiteBackground: {
      main: '#161616',
      dark: '#000000'
    }
  }
});
export default darkTheme;