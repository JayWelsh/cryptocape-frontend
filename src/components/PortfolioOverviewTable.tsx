import React, { useEffect, useState } from 'react';

import SortableTable from './SortableTable';

import { PropsFromRedux } from '../containers/PortfolioOverviewTableContainer';

import { priceFormat } from "../utils";

import {
  IPortfolioOverviewData,
} from '../interfaces';

// todo coingecko icons
// const imageGetter = ((symbol: string) => ``)

// const networkImageGetter = ((network: string) => {
//   switch(network) {
//     case "ethereum":
//       return "https://vagabond-public-storage.s3.eu-west-2.amazonaws.com/ethereum-logo.png";
//     case "arbitrum":
//       return "https://vagabond-public-storage.s3.eu-west-2.amazonaws.com/arbitrum-logo.svg";
//     default:
//       return "";
//   }
// })

// todo coingecko links
const externalLinkGetter = ((symbol: string) => `/${symbol}`)

interface IPortfolioOverviewTable {
  portfolioOverviewData: IPortfolioOverviewData[]
}

export default function PortfolioOverviewTable(props: PropsFromRedux & IPortfolioOverviewTable) {

  const {
    portfolioOverviewData,
  } = props;

  const [portfolioOverviewStateData, setPortfolioOverviewStateData] = useState<IPortfolioOverviewData[]>([]);

  useEffect(() => {
    setPortfolioOverviewStateData(portfolioOverviewData);
  }, [portfolioOverviewData])

//   IPortfolioOverviewData {
//     symbol: string;
//     tokenValue: number;
//     portfolioValue: number;
//     marketCap: number;
//     tokenQuantity: number;
//     portfolioPortion: number;
//     tokenValueChangePercent24Hr: number;
//     relativePortfolioValueChangePercent24Hr: number;
// }

  return (
    <>
      <SortableTable
        // tableHeading="Portfolio Overview"
        defaultSortValueKey="portfolioValue"
        columnConfig={[
          {
            id: 'portfolio-overview-token-symbol-col',
            label: 'Symbol',
            valueKey: 'symbol',
            numeric: false,
            disablePadding: false,
            // imageGetter: imageGetter,
            // fallbackImage: 'https://vagabond-public-storage.s3.eu-west-2.amazonaws.com/question-mark-white.svg',
            externalLinkGetter: externalLinkGetter,
          },
          {
            id: 'portfolio-overview-table-portfolio-value-col',
            label: 'Value',
            valueKey: 'portfolioValue',
            numeric: true,
            disablePadding: false,
            valueFormatter: priceFormat,
          },
          {
            id: 'portfolio-overview-token-value-col',
            label: 'Price',
            valueKey: 'tokenPrice',
            numeric: true,
            disablePadding: false,
            valueFormatter: priceFormat,
          },
          {
            id: 'portfolio-overview-table-market-cap-col',
            label: 'Market Cap',
            valueKey: 'marketCap',
            numeric: true,
            disablePadding: false,
            valueFormatter: priceFormat,
          },
          {
            id: 'portfolio-overview-table-token-balance-col',
            label: 'Balance',
            valueKey: 'tokenQuantity',
            numeric: true,
            disablePadding: false,
            valueFormatterKeyArgs: ['tokenQuantity', 'symbol'],
            valueFormatter: (value, symbol) => priceFormat(value, 2, symbol, false),
          },
          {
            id: 'portfolio-overview-portion-col',
            label: '% of Portfolio',
            valueKey: 'portfolioPortion',
            numeric: true,
            disablePadding: false,
            valueFormatter: (value) => priceFormat(value, 2, '%', false),
          },
          {
            id: 'portfolio-overview-table-token-percent-change-24hr-col',
            label: '% Change 24 Hr',
            valueKey: 'tokenPriceChangePercent24Hr',
            numeric: true,
            disablePadding: false,
            positiveGood: true,
            negativeBad: true,
            valueFormatter: (value) => priceFormat(value, 2, '%', false),
          },
          {
            id: 'portfolio-overview-portfolio-impact-percent-24hr-col',
            label: 'Portfolio Impact 24 Hr',
            valueKey: 'relativePortfolioValueChangePercent24Hr',
            numeric: true,
            disablePadding: false,
            positiveGood: true,
            negativeBad: true,
            valueFormatter: (value) => priceFormat(value, 2, '%', false),
          },
        ]}
        tableData={portfolioOverviewStateData}
      />
    </>
  );
}