import React, { useEffect, useState } from 'react';

import { utils } from "ethers";

import BigNumber from 'bignumber.js';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { PropsFromRedux } from './containers/PortfolioPageContainer';

import LoadingIconContainer from '../containers/LoadingIconContainer';

import { useQuery } from '../hooks';

import {
  API_ENDPOINT,
} from '../constants';

import {
  ITimeseriesEntry,
  ITimeseriesResponse,
  IPortfolioOverviewData,
  IBalancesCombinedResponse,
} from '../interfaces';

import { 
  priceFormat, 
  // sleep,
} from '../utils';

import BasicAreaChartContainer from '../containers/BasicAreaChartContainer';
import PortfolioOverviewTableContainer from '../containers/PortfolioOverviewTableContainer';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topSpacer: {
      marginTop: theme.spacing(6),
    },
    sectionSpacer: {
      marginTop: theme.spacing(4),
    },
    cardContent: {
      padding: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  }),
);

const getTitleFontSize = (isConsideredMobile: boolean, isConsideredMedium: boolean) => {
  if(isConsideredMobile) {
    return '2rem';
  } else if(isConsideredMedium) {
    return '4rem';
  }
  return '7rem';
}

const getTitleFontBoxHeight = (isConsideredMobile: boolean, isConsideredMedium: boolean) => {
  if(isConsideredMobile) {
    return '104px';
  } else if(isConsideredMedium) {
    return '141px';
  }
  return '197px';
}

const getTitleLoadingIconHeight = (isConsideredMobile: boolean, isConsideredMedium: boolean) => {
  if(isConsideredMobile) {
    return 18;
  } else if(isConsideredMedium) {
    return 25;
  }
  return 30;
}

const PortfolioPage = (props: PropsFromRedux) => {

  let {
    isConsideredMobile,
    isConsideredMedium,
    // setLoadingProgress,
  } = props;

  const classes = useStyles();

  let query = useQuery();

  let addresses = query.get("addresses");

  const [isLoading, setIsLoading] = useState(false);
  const [portfolioAddresses, setPortfolioAddresses] = useState<string[]>([]);
  const [portfolioTimeseries, setPortfolioTimeseries] = useState<ITimeseriesEntry[]>([]);
  const [portfolioCurrentValue, setPortfolioCurrentValue] = useState<number | undefined>();
  const [portfolioOverviewData, setPortfolioOverviewData] = useState<IPortfolioOverviewData[]>([]);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(new Date().getTime());
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().getTime());
  const [fetchIndex, setFetchIndex] = useState(0);

  let secondsSinceUpdate = Math.floor(currentTimestamp / 1000) - Math.floor(lastUpdateTimestamp / 1000);

  const autoUpdatePeriod = 30;

  useEffect(() => {
    let isMounted = true;
    const refreshPortfolio = async () => {
      setIsLoading(true);
      if(addresses) {
        let addressArray = addresses?.split(',');
        setPortfolioAddresses(addressArray);
        // setLoadingProgress(1);
        Promise.all([
          fetch(`${API_ENDPOINT}/balances/combined?addresses=${addresses}`).then(resp => resp.json()),
          fetch(`${API_ENDPOINT}/history/account-value-snapshot?addresses=${addresses}`).then(resp => resp.json()),
        ]).then(async (data) => {
          const [currentDataResponse, historicalDataResponse] = data;
          const { data: currentData } : IBalancesCombinedResponse = currentDataResponse;
          const { data: historicalData } = historicalDataResponse;
          let timeseriesData = historicalData.map((historicalEntry: ITimeseriesResponse) => ({
            value: Number(historicalEntry.value),
            date: historicalEntry.timestamp
          }));
          let totalValues : IPortfolioOverviewData = {
            symbol: 'Total',
            tokenPrice: 0,
            portfolioValue: 0,
            marketCap: 0,
            tokenQuantity: 0,
            portfolioPortion: 100,
            coingeckoId: false,
            tokenPriceChangePercent24Hr: 0,
            relativePortfolioValueChangePercent24Hr: 0,
          }
          let newPortfolioOverviewData : IPortfolioOverviewData[] = Object.entries(currentData.assetAddressToValue).map(([tokenAddress, tokenDetails]) => {
            let tokenPriceField : number = Number(tokenDetails.token_price);
            let portfolioValueField : number = Number(tokenDetails.value);
            let marketCapField : number = Number(tokenDetails.market_cap_usd);
            let tokenQuantityField : number = new BigNumber(utils.formatUnits(tokenDetails.balance, tokenDetails.token_decimals)).toNumber();
            let portfolioPortionField : number = Number(tokenDetails.percentage_of_total);
            let tokenPriceChangePercent24HrField : number = Number(tokenDetails.change_24hr_usd_percent);
            let relativePortfolioValueChangePercent24HrField : number = (Number(tokenDetails.change_24hr_usd_percent) / 100) * Number(tokenDetails.percentage_of_total);

            totalValues.tokenPrice += tokenPriceField;
            totalValues.portfolioValue += portfolioValueField;
            totalValues.marketCap += marketCapField;
            totalValues.tokenQuantity += tokenQuantityField;
            totalValues.tokenPriceChangePercent24Hr += tokenPriceChangePercent24HrField;
            totalValues.relativePortfolioValueChangePercent24Hr += relativePortfolioValueChangePercent24HrField;

            return {
              symbol: tokenDetails.symbol,
              tokenPrice: tokenPriceField,
              portfolioValue: portfolioValueField,
              marketCap: marketCapField,
              tokenQuantity: tokenQuantityField,
              portfolioPortion: portfolioPortionField,
              coingeckoId: tokenDetails.coingecko_id ? tokenDetails.coingecko_id : false,
              tokenPriceChangePercent24Hr: tokenPriceChangePercent24HrField,
              relativePortfolioValueChangePercent24Hr: relativePortfolioValueChangePercent24HrField,
            }
          })
          newPortfolioOverviewData.push(totalValues);
          if(isMounted) {
            if(currentData?.total) {
              setPortfolioCurrentValue(Number(currentData?.total));
              timeseriesData.push({
                value: Number(currentData?.total),
                date: new Date().toISOString(),
              })
            }
            setPortfolioTimeseries(timeseriesData);
            setLastUpdateTimestamp(new Date().getTime());
            setPortfolioOverviewData(newPortfolioOverviewData);
            // setLoadingProgress(100);
            setIsLoading(false);
            // await sleep(1000);
            // setLoadingProgress(0);
          }
        })
      }
    }
    refreshPortfolio();
    return () => {
      isMounted = false;
      // setLoadingProgress(0);
    }
  }, [addresses, fetchIndex])

  useEffect(() => {

    const timetrackerIntervalId = setInterval(() => {
      setCurrentTimestamp(new Date().getTime());
      let secondsSinceLastUpdate = Number(((currentTimestamp - lastUpdateTimestamp) / 1000).toFixed(0));
      if(secondsSinceLastUpdate > 0) {
        if((secondsSinceLastUpdate % autoUpdatePeriod === 0) && !isLoading) {
          setFetchIndex(fetchIndex + 1);
        }
      }
    }, 1000);

    return () => clearInterval(timetrackerIntervalId);
  });

  useEffect(() => {
    let isMounted = true;
    if ((secondsSinceUpdate > autoUpdatePeriod) && !isLoading) {
      let secondsUntilNextAutoUpdate = autoUpdatePeriod - (secondsSinceUpdate % autoUpdatePeriod);
      if(secondsSinceUpdate && (secondsUntilNextAutoUpdate >= 3) && isMounted) {
        setFetchIndex(fetchIndex + 1);
      }
    }
    return () => {
      isMounted = false;
    }
  }, [secondsSinceUpdate, fetchIndex, isLoading])

  return (
    <Container maxWidth="xl">
      {portfolioTimeseries &&
        <div className={(isConsideredMobile || isConsideredMedium) ? classes.sectionSpacer : classes.topSpacer}>
          <div style={{width: '100%'}}>
            <BasicAreaChartContainer
              chartData={portfolioTimeseries}
              loading={isLoading}
              leftTextTitle={`Portfolio History`}
              leftTextSubtitle={`${portfolioAddresses.length} Address Bundle`}
              rightTextFormatValueFn={(value: any) => priceFormat(value, 2, '$')}
              showChange={true}
              changeType={"up-good"}
              height={500}
              formatValueFn={(value: any) => priceFormat(value, 2, "$")}
            />
          </div>
        </div>
      }
      <div className={(isConsideredMobile || isConsideredMedium) ? classes.sectionSpacer : classes.topSpacer}>
        <div style={{width: '100%'}}>
          <Card className={classes.cardContent} style={{overflowX: 'auto', ...(!portfolioCurrentValue && { height: getTitleFontBoxHeight(isConsideredMobile, isConsideredMedium)})}}>
            {portfolioCurrentValue 
              ? 
                <Typography style={{fontSize: getTitleFontSize(isConsideredMobile, isConsideredMedium)}} variant="h1">
                  { priceFormat(portfolioCurrentValue, 2, '$') }
                </Typography>
              : 
                <LoadingIconContainer height={getTitleLoadingIconHeight(isConsideredMobile, isConsideredMedium)}/>
            }
          </Card>
        </div>
      </div>
      <div className={classes.sectionSpacer}>
        <Typography className={"align-center"} style={{fontWeight: 'bold'}} variant="h6">
          updated {(Number(((currentTimestamp - lastUpdateTimestamp) / 1000).toFixed(0)) > 0 ? ((currentTimestamp - lastUpdateTimestamp) / 1000).toFixed(0) : 0) + ' seconds ago'}
        </Typography>
      </div>
      {portfolioOverviewData &&
        <div className={classes.sectionSpacer}>
          <PortfolioOverviewTableContainer portfolioOverviewData={portfolioOverviewData} />
        </div>
      }
    </Container>
  )
};

export default PortfolioPage;