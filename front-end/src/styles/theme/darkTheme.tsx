import { createTheme } from '@mui/material/styles';
import { Palette, TypeBackground, PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles'
{
  interface PaletteOptions {
    risenBoxBg: PaletteOptions['primary'];
    risenVictory: PaletteOptions['primary'];
    risenDefeat: PaletteOptions['primary'];
  }

  interface Palette {
    risenBoxBg: Palette['primary'];
    risenVictory: Palette['primary'];
    risenDefeat: Palette['primary'];
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
    }
  }
});
export default darkTheme;