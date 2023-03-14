import React, { useEffect, useState } from 'react';

import { utils } from "ethers";

import BigNumber from 'bignumber.js';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

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

import { priceFormat } from '../utils';

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
      textAlign: 'center',
    },
  }),
);

const PortfolioPage = () => {

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

  useEffect(() => {
    let isMounted = true;
    const refreshPortfolio = async () => {
      setIsLoading(true);
      if(addresses) {
        let addressArray = addresses?.split(',');
        setPortfolioAddresses(addressArray);
        console.log({addressArray})
        Promise.all([
          fetch(`${API_ENDPOINT}/balances/combined?addresses=${addresses}`).then(resp => resp.json()),
          fetch(`${API_ENDPOINT}/history/account-value-snapshot?addresses=${addresses}`).then(resp => resp.json()),
        ]).then((data) => {
          const [currentDataResponse, historicalDataResponse] = data;
          const { data: currentData } : IBalancesCombinedResponse = currentDataResponse;
          const { data: historicalData } = historicalDataResponse;
          let timeseriesData = historicalData.map((historicalEntry: ITimeseriesResponse) => ({
            value: Number(historicalEntry.value),
            date: historicalEntry.timestamp
          }));
          let newPortfolioOverviewData : IPortfolioOverviewData[] = Object.entries(currentData.assetAddressToValue).map(([tokenAddress, tokenDetails]) => ({
            symbol: tokenDetails.symbol,
            tokenPrice: Number(tokenDetails.token_price),
            portfolioValue: Number(tokenDetails.value),
            marketCap: Number(tokenDetails.market_cap_usd),
            tokenQuantity: new BigNumber(utils.formatUnits(tokenDetails.balance, tokenDetails.token_decimals)).toNumber(),
            portfolioPortion: Number(tokenDetails.percentage_of_total),
            tokenPriceChangePercent24Hr: Number(tokenDetails.change_24hr_usd_percent),
            relativePortfolioValueChangePercent24Hr: (Number(tokenDetails.change_24hr_usd_percent) / 100) * Number(tokenDetails.percentage_of_total),
          }))
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
            setIsLoading(false);
          }
        })
      }
    }
    refreshPortfolio();
    return () => {
      isMounted = false;
    }
  }, [addresses, fetchIndex])

  useEffect(() => {
      const priceExpirySeconds = 30;

      const timetrackerIntervalId = setInterval(() => {
          setCurrentTimestamp(new Date().getTime());
          let secondsSinceLastUpdate = Number(((currentTimestamp - lastUpdateTimestamp) / 1000).toFixed(0));
          if(secondsSinceLastUpdate > 0) {
              if(secondsSinceLastUpdate % priceExpirySeconds === 0) {
                  setFetchIndex(fetchIndex + 1);
              }
          }
      }, 1000);

      return () => clearInterval(timetrackerIntervalId);
  });

  return (
    <Container maxWidth="xl">
      {portfolioTimeseries &&
        <div className={classes.topSpacer}>
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
      <div className={classes.topSpacer}>
        <div style={{width: '100%'}}>
          <Card className={classes.cardContent}>
            <Typography style={{fontSize: '7rem'}} variant="h1">
              {portfolioCurrentValue ? priceFormat(portfolioCurrentValue, 2, '$') : '...'}
            </Typography>
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