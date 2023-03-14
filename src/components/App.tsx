import React, { useLayoutEffect } from 'react';

// import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { Toaster } from 'sonner'

import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '../styles/App.css';
import { PropsFromRedux } from '../containers/AppContainer';

import PageContainer from './PageContainer';

import { useWindowSize } from '../hooks'
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = (props: PropsFromRedux) => {

  const { setConsideredMobile } = props;

  const windowSize = useWindowSize();

  useLayoutEffect(() => {
    let sizeConsiderMobile = 680;
    if (windowSize.width && (windowSize.width <= sizeConsiderMobile)) {
      setConsideredMobile(true);
    }else{
      setConsideredMobile(false);
    }
  }, [windowSize.width, windowSize.height, setConsideredMobile])

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
