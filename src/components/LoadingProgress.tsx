import React from 'react';

import { animated, useSpring, config } from '@react-spring/web'

import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import { PropsFromRedux } from '../containers/LoadingProgressContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linearColorPrimaryDarkMode: {
      backgroundColor: '#000000',
    },
    linearBarColorPrimaryDarkMode: {
      backgroundColor: '#ff14fcd9',
    },
  }),
);

const LoadingProgress = (props: PropsFromRedux) => {

    const { 
      loadingProgress,
    } = props;

    const classes = useStyles();

    const loadingProgressSpring = useSpring({
      from: {
        width: `0%`
      },
      to: {
        width: `${loadingProgress}%`
      },
      delay: 0,
      config: config.gentle,
    })

    return (
      <>
        <animated.div
          className={classes.linearBarColorPrimaryDarkMode}
          style={{...loadingProgressSpring, ...(loadingProgress > 0 ? {opacity: 1} : {opacity: 0}), height: 3}}
        />
      </>
    )
}

export default LoadingProgress