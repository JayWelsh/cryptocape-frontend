import React, { useLayoutEffect } from 'react';

// import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { Toaster } from 'sonner'

import { createTheme, StyledEngineProvider, Theme, ThemeProvider, PaletteColorOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '../styles/App.css';
import { PropsFromRedux } from '../containers/AppContainer';

import PageContainer from './PageContainer';

import { useWindowSize } from '../hooks'
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface CustomPalette {
    passive: PaletteColorOptions;
    limegreen: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    passive: true;
    limegreen: true;
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;

const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

const App = (props: PropsFromRedux) => {

  const { 
    setConsideredMobile,
    setConsideredMedium,
  } = props;

  const windowSize = useWindowSize();

  useLayoutEffect(() => {
    let sizeConsiderMobile = 680;
    let sizeConsideredMedium = 1000;
    if (windowSize.width && (windowSize.width <= sizeConsiderMobile)) {
      setConsideredMobile(true);
    }else{
      setConsideredMobile(false);
    }
    if (windowSize.width && (windowSize.width <= sizeConsideredMedium)) {
      setConsideredMedium(true);
    }else{
      setConsideredMedium(false);
    }
  }, [windowSize.width, windowSize.height, setConsideredMobile, setConsideredMedium])

  const theme = React.useMemo(
    () =>
      createTheme({
        shape: {
          borderRadius: 8
        },
        palette: {
          mode: props.darkMode ? 'dark' : 'light',
          secondary: {
            main: '#e04dffd9',
          },
          passive: createColor('#FFFFFF'),
          limegreen: createColor('#32cd32'),
          ...(props.darkMode && {
            background: {
              default: "#131313",
              paper: "#000000"
            }
          })
        },
        components: {
          MuiCard :{
            styleOverrides: {
              root:{
                border: "1px solid #ffffff3b"
              }
            }
          },
        }
      }),
    [props.darkMode],
  );

  return (
    //@ts-ignore
    <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Toaster richColors position="bottom-right" />
            <PageContainer/>
          </ThemeProvider>
        </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
