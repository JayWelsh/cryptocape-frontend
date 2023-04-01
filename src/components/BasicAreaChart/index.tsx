import React, {useEffect, useState} from 'react';

import BigNumber from 'bignumber.js';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import Typography from '@mui/material/Typography';

import ParentSize from '@visx/responsive/lib/components/ParentSize';

import LoadingIconContainer from '../../containers/LoadingIconContainer';

import BasicAreaChartInner from './BasicAreaChartInner'
import BrushChart from '../BrushChart';

import { priceFormat } from '../../utils';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

export interface ITimeseries {
  date: string;
  value: number;
}

const placeholderData = [
  {
    value: 0,
    date: "2022-12-01T00:00:00.000Z",
  },
  {
    value: 1,
    date: "2022-12-30T00:00:00.000Z",
  }
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingIconContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingIcon: {
      width: 'auto',
      height: 30,
      opacity: 0.6,
    }
  }),
);

interface IBasicAreaChartProps {
  chartData: ITimeseries[]
  height: number
  leftTextTitle?: string
  leftTextSubtitle?: string
  rightText?: string
  showChange?: boolean
  changeType?: "neutral" | "up-good" | "down-good",
  isPercentage?: boolean,
  loading?: boolean,
  formatValueFn: (arg1: string | number) => string,
  rightTextFormatValueFn?: (arg1: string | number) => string,
  hideTime?: boolean,
  isConsideredMobile: boolean,
  earliestSelectedIndex: number,
}

const neutralColor = "#ff14fc";
const goodColor = "limegreen";
const badColor = "orange";

const BasicAreaChart = (props: IBasicAreaChartProps) => {

    const {
      chartData,
      height,
      leftTextTitle,
      leftTextSubtitle,
      rightText,
      rightTextFormatValueFn,
      showChange,
      changeType,
      isPercentage,
      formatValueFn,
      isConsideredMobile,
      hideTime,
      earliestSelectedIndex,
      loading,
    } = props;

    const classes = useStyles();

    const [filteredChartData, setFilteredChartData] = useState(chartData);

    useEffect(() => {
      setFilteredChartData(chartData);
    }, [chartData])

    const getChange = (firstValue: number, lastValue: number) => {
      let returnString = "+ 0.00 %"
      if(lastValue > firstValue) {
        if(isPercentage) {
          returnString = `+ ${priceFormat(Number((lastValue - firstValue).toFixed(2)), 2, '%', false)}`
        } else {
          returnString = `+ ${priceFormat(Math.abs(new BigNumber(lastValue).multipliedBy(100).dividedBy(firstValue).minus(100).decimalPlaces(2).toNumber()), 2, '%', false)}`
        }
      } else if (firstValue > lastValue) {
        if(isPercentage) {
          returnString = `- ${priceFormat(Number(Math.abs(lastValue - firstValue).toFixed(2)), 2, '%', false)}`
        } else {
          returnString = `- ${priceFormat(Math.abs(new BigNumber(lastValue).multipliedBy(100).dividedBy(firstValue).minus(100).decimalPlaces(2).toNumber()), 2, '%', false)}`
        }
      }
      return returnString;
    }

    const getChangeColor = (firstValue: number, lastValue: number) => {
      let changeColor = '#ffffff';
      let change = lastValue - firstValue;
      if(change < 0) {
        if(changeType === "neutral") {
          changeColor = neutralColor
        }
        if (changeType === 'up-good') {
          changeColor = badColor
        }
        if (changeType === 'down-good') {
          changeColor = goodColor
        }
      }
      if(change > 0) {
        if(changeType === "neutral") {
          changeColor = neutralColor
        }
        if (changeType === 'up-good') {
          changeColor = goodColor
        }
        if (changeType === 'down-good') {
          changeColor = badColor
        }
      }
      return changeColor;
    }

    return (
      <div className="graph-zone-container" style={{minHeight: height, width: '100%', position: 'relative', borderRadius: 8, backgroundColor: 'black'}}>
        <div
          style={{
            height: 76,
            width: '100%',
            backgroundColor: 'black',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {leftTextTitle &&
              <Typography variant="h6" style={{lineHeight: 1, marginBottom: 10}}>
                {leftTextTitle || 'Loading...'}
              </Typography>
            }
            {leftTextSubtitle &&
              <Typography variant="subtitle1" style={{lineHeight: 1, alignSelf: 'start', fontWeight: 'bold'}}>
                {leftTextSubtitle || 'Loading...'}
              </Typography>
            }
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Typography variant="h6" style={{lineHeight: 1, marginBottom: 10, alignSelf: 'end'}}>
              {!rightText && ((rightTextFormatValueFn && (filteredChartData.length > 0)) ? rightTextFormatValueFn(filteredChartData[filteredChartData.length - 1].value) : 'Loading...')}
              {(!rightTextFormatValueFn && (rightText || 'Loading...'))}
            </Typography>
            {(showChange && filteredChartData?.length > 0) 
              ?
                <Typography variant="subtitle1" style={{lineHeight: 1, alignSelf: 'end', color: getChangeColor(filteredChartData[0].value, filteredChartData[filteredChartData.length - 1].value)}}>
                  {getChange(filteredChartData[0].value, filteredChartData[filteredChartData.length - 1].value)}
                </Typography>
              :
              <Typography variant="subtitle1" style={{lineHeight: 1, alignSelf: 'end'}}>
                Loading...
              </Typography>
            }
          </div>
        </div>
        {loading &&
          <div style={{height: 465, width: '100%'}} className={classes.loadingIconContainer}>
            <LoadingIconContainer />
          </div>
        }
        <ParentSize style={{...(loading && { opacity: 0.6 })}} debounceTime={10}>
          {({ width: w }) => {
            return (
              <>
                <BasicAreaChartInner
                    width={w}
                    height={height}
                    timeseries={(filteredChartData && filteredChartData.length > 0) ? filteredChartData : placeholderData}
                    isLoadingPlaceholder={(filteredChartData && filteredChartData.length > 0) ? false : true}
                    formatValue={formatValueFn}
                    hideTime={hideTime}
                />
              </>
            )
          }}
        </ParentSize>
        {!isConsideredMobile &&
          <div style={{padding: 10}}>
            <ParentSize debounceTime={10}>
              {({ width: w }) => {
                  return (
                    <>
                      <BrushChart 
                        timeseries={(chartData && chartData.length > 0) ? chartData : placeholderData}
                        isLoadingPlaceholder={(chartData && chartData.length > 0) ? false : true}
                        setFilteredChartData={setFilteredChartData}
                        earliestSelectedIndex={earliestSelectedIndex}
                        height={100}
                        width={w}
                      />
                    </>
                  )
              }}
            </ParentSize>
          </div>
        }
      </div>
    )
};

export default BasicAreaChart;