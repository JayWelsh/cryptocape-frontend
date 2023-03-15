import React from 'react';
import {Routes, Route} from 'react-router-dom';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import Navigation from './Navigation';

import HomePageContainer from '../pages/containers/HomePageContainer';
import PortfolioPageContainer from '../pages/containers/PortfolioPageContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),
);

const PageContainer = () => {

    const classes = useStyles();

    return (
        <Navigation>
            <div className={classes.root}>
                <Routes>
                    <Route path="/" element={<HomePageContainer />} />
                    <Route path="/portfolio" element={<PortfolioPageContainer />} />
                </Routes>
            </div>
        </Navigation>
    )
}

export default PageContainer;