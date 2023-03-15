import React, { Fragment } from 'react';

import { animated, useSprings, config } from '@react-spring/web'

import LogoDarkMode from '../assets/png/logo.png'
import LogoLightMode from '../assets/png/logo.png'

import { PropsFromRedux } from '../containers/LoadingIconContainer';

interface ILoadingIcon {
  opacity?: number,
  height?: number,
}

const LoadingIcon = (props: PropsFromRedux & ILoadingIcon) => {

  let {
    darkMode,
    opacity = 0.6,
    height = 40,
  } = props;
  
  let springLength = 5;

  const [autoSprings] = useSprings(
    springLength,
    (springIndex: number) => ({
      delay: 150,
      from: {
        rotate: '0deg',
        scale: `1`,
      },
      to: async (next, cancel) => {
        await next({ 
          rotate: `-${springIndex * 7}deg`,
          scale: `${springIndex > 0 ? `${1.03 - (springIndex * 0)}` : 1.05}`,
        })
        await next({ 
          rotate: `0deg`,
          scale: `1`,
        })
      },
      config: config.wobbly,
      loop: true,
    }),
    []
  )

  const [inverseAutoSprings] = useSprings(
    springLength,
    (springIndex: number) => ({
      delay: 150,
      from: {
        rotate: '0deg',
        scale: `1`,
      },
      to: async (next, cancel) => {
        await next({ 
          rotate: `${springIndex * 7}deg`,
          scale: `${springIndex > 0 ? `${1.03 - (springIndex * 0)}` : 1.05}`,
        })
        await next({ 
          rotate: `0deg`,
          scale: `1`,
        })
      },
      config: config.wobbly,
      loop: true,
    }),
    []
  )

  return (
    <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity, height: `${height + (height * 2)}px`}}>
      <div style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
        {autoSprings.map((spring, index) => 
          index === 0 
          ? 
            <animated.img key={`logo-easter-egg-${index}`} style={{...spring, cursor: 'progress', zIndex: springLength + 1, position: 'relative'}} height={`${height}px`} src={darkMode ? LogoDarkMode : LogoLightMode} alt="logo" />
          : 
          <Fragment key={`logo-easter-egg-${index}-1`}>
            <animated.img style={{...spring, cursor: 'progress', position: 'absolute', zIndex: springLength - index, opacity: 1, left: 0}} height={`${height}px`} src={darkMode ? LogoDarkMode : LogoLightMode} alt="logo" />
            <animated.img style={{...inverseAutoSprings[index], cursor: 'progress', position: 'absolute', zIndex: springLength - index, opacity: 1, left: 0}} height={`${height}px`} src={darkMode ? LogoDarkMode : LogoLightMode} alt="logo" />
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default LoadingIcon