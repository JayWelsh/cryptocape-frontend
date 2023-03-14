import React, { useState, useEffect, Fragment } from 'react';

import { animated, useSprings, config } from '@react-spring/web'

import { useNavigate } from "react-router-dom";

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import GitHubIcon from '@mui/icons-material/GitHub';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import DarkModeIcon from '@mui/icons-material/NightsStay';
// import LightModeIcon from '@mui/icons-material/WbSunny';

import DiscordLogo from '../assets/svg/discord.svg';
import TelegramLogo from '../assets/svg/telegram.svg';

import LogoDarkMode from '../assets/png/logo.png'
import LogoLightMode from '../assets/png/logo.png'

// import { Web3ModalButton } from './Web3ModalButton';
import { PropsFromRedux } from '../containers/NavigationTopBarContainer';
import { ExternalLink } from '../components/ExternalLink';

import GithubRepoNavigatorDialog from './GithubRepoNavigatorDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      cursor: 'pointer',
      fontFamily: 'monospace',
      marginRight: theme.spacing(2),
    },
    flexer: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
    logoSpacer: {
      marginRight: theme.spacing(2),
    },
    socialIcon: {
      maxWidth: 35,
      width: '100%',
      maxHeight: 35,
      height: '100%',
      marginLeft: theme.spacing(2)
    }
  }),
);

interface INavigationTopBarProps {
  isConsideredMobile: boolean;
}

const NavigationTopBar = (props: PropsFromRedux & INavigationTopBarProps) => {
  const classes = useStyles();

  let {
    isConsideredMobile,
  } = props;

  let navigate = useNavigate();

  // const [localShowLeftMenu, setLocalShowLeftMenu] = useState(props.showLeftMenu)
  const [localDarkMode, setLocalDarkMode] = useState(props.darkMode)
  const [showGithubNavigation, setShowGithubNavigation] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [logoClickHold, setLogoClickHold] = useState(false);

  useEffect(() => {
    // setLocalShowLeftMenu(props.showLeftMenu)
  }, [props.showLeftMenu])

  useEffect(() => {
    setLocalDarkMode(props.darkMode)
  }, [props.darkMode])
  
  let springLength = 5;

  const [springs] = useSprings(
    springLength,
    (springIndex: number) => ({
      from: {
        rotate: '0deg',
      },
      to: {
        rotate: logoHovered && !logoClickHold ? `-${springIndex * 7}deg` : "0deg",
        scale: logoHovered && !logoClickHold ? `${springIndex > 0 ? `${1.03 - (springIndex * 0)}` : 1.05}` : "1",
      },
      config: config.wobbly,
    }),
    [logoHovered, logoClickHold]
  )

  const [inverseSprings] = useSprings(
    springLength,
    (springIndex: number) => ({
      from: {
        rotate: '0deg',
      },
      to: {
        rotate: logoHovered && !logoClickHold ? `${springIndex * 7}deg` : "0deg",
        scale: logoHovered && !logoClickHold ? `${springIndex > 0 ? `${1.03 - (springIndex * 0)}` : 1.05}` : "1",
      },
      config: config.wobbly,
    }),
    [logoHovered, logoClickHold]
  )

  return (
    <div className={classes.root}>
      <AppBar style={{background: 'linear-gradient(-90deg, #000000, #000000)'}} position="static">
        <Toolbar>
          {/* <IconButton
            onClick={() => props.setShowLeftMenu(!localShowLeftMenu)}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            size="large">
            <MenuIcon />
          </IconButton> */}
          {/* <div style={{width: '115px', position: 'relative', marginRight: '15px', alignSelf: 'start'}}>
            <img onClick={() => props.history.push('/')} height={'115px'} style={{cursor: 'pointer', position: 'absolute', top: 10}} src={localDarkMode ? LogoDarkMode : LogoLightMode} alt="logo" />
          </div> */}
          
          {springs.map((spring, index) => 
            index === 0 
            ? 
              <animated.img key={`logo-easter-egg-${index}`} onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)} onMouseDown={() => setLogoClickHold(true)} onMouseUp={() => setLogoClickHold(false)} style={{...spring, cursor: 'pointer', zIndex: springLength + 1}} onClick={() => navigate('/')} height={'40px'} src={localDarkMode ? LogoDarkMode : LogoLightMode} className={[classes.logoSpacer].join(' ')} alt="logo" />
            : 
            <Fragment key={`logo-easter-egg-${index}-1`}>
              <animated.img onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)} style={{...spring, cursor: 'pointer', position: 'absolute', zIndex: springLength - index, opacity: 1}} onClick={() => navigate('/')} height={'40px'} src={localDarkMode ? LogoDarkMode : LogoLightMode} className={[classes.logoSpacer].join(' ')} alt="logo" />
              <animated.img onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)} style={{...inverseSprings[index], cursor: 'pointer', position: 'absolute', zIndex: springLength - index, opacity: 1}} onClick={() => navigate('/')} height={'40px'} src={localDarkMode ? LogoDarkMode : LogoLightMode} className={[classes.logoSpacer].join(' ')} alt="logo" />
            </Fragment>
          )}
          <div className={classes.flexer}/>
          {!isConsideredMobile &&
            <div className={"flex-center-all"}>
              <ExternalLink className={"hover-opacity-button flex-center-all"} href={"https://discord.gg/x6T427nAH7"}>
                <img alt="Discord Server Link" className={classes.socialIcon} style={{width: 40}} src={DiscordLogo} />
              </ExternalLink>
              <ExternalLink className={"hover-opacity-button flex-center-all"} href={"https://t.me/joinchat/GeDYFkq_0ih60gmc"}>
                <img alt="Telegram Chat Link" className={classes.socialIcon} style={{width: 40}} src={TelegramLogo} />
              </ExternalLink>
              <GitHubIcon onClick={() => setShowGithubNavigation(true)} style={{width: 40}} className={[classes.socialIcon, "hover-opacity-button"].join(' ')}/>
            </div>
          }
          {/* <Web3ModalButton/>
          <IconButton
            color="inherit"
            onClick={() => props.setDarkMode(!localDarkMode)}
            aria-label="delete"
            className={classes.margin}
            size="large">
            {localDarkMode ? <LightModeIcon/> : <DarkModeIcon />}
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <GithubRepoNavigatorDialog open={showGithubNavigation} onClose={() => setShowGithubNavigation(false)}/>
    </div>
  );
}

export default NavigationTopBar