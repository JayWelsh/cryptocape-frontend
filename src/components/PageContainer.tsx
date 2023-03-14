import React from 'react';
import {Routes, Route} from 'react-router-dom';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import Navigation from './Navigation';

import HomePage from '../pages/HomePage';
import PortfolioPage from '../pages/PortfolioPage';

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
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                </Routes>
            </div>
        </Navigation>
    )
}

export default PageContainer;