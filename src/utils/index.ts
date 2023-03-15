import numeral from "numeral";
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

export const centerShortenLongString = (string: string, maxLength: number) => {
	if(typeof string === 'string') {
		if(string.length > maxLength) {
			let charCountForRemoval = string.length - maxLength;
			let stringHalfwayPoint = Math.floor(maxLength/2);
			string = string.slice(0, stringHalfwayPoint) + "..." + string.slice(stringHalfwayPoint + charCountForRemoval, string.length);
			return string;
		}else{
			return string;
		}
	}else{
		return '';
	}
}

const getDynamicFormat = (currentFormat = '0,0.00', number: number) => {
	let requestedDecimals = 0;
	let preDecimalFormat;
	let postDecimalFormat;
	if(currentFormat.split(".").length > 0) {
			requestedDecimals = currentFormat.split(".")[1].length;
			postDecimalFormat = currentFormat.split(".")[1];
			preDecimalFormat = currentFormat.split(".")[0];
	}
	let currentFormattedNumber = numeral(number).format(currentFormat).toString();
	let currentFormattedDecimals = '';
	if(currentFormattedNumber.split('.') && currentFormattedNumber.split('.')[1]) {
			currentFormattedDecimals = currentFormattedNumber.split('.')[1];
	}
	let currentUnformattedDecimals = '';
	if(number.toString().split(".").length > 0 && number.toString().split(".")[1]) {
			currentUnformattedDecimals = number.toString().split(".")[1];
	}
	let dynamicFormat = currentFormat;
	if((currentFormattedDecimals.replace(/[^1-9]/g,"").length < requestedDecimals) && (currentUnformattedDecimals.replace(/[^1-9]/g,"").length >= requestedDecimals)) {
			let indexOfSignificantFigureAchievement = 0;
			let significantFiguresEncountered = 0;
			let numberString = number.toString();
			let numberStringPostDecimal = "";
			if(numberString.split(".").length > 0) {
					numberStringPostDecimal = numberString.split(".")[1]
			}
			for(let i = 0; i < numberStringPostDecimal.length; i++) {
					// @ts-ignore
					if((numberStringPostDecimal[i] * 1) > 0) {
							significantFiguresEncountered++;
							if(significantFiguresEncountered === requestedDecimals) {
									indexOfSignificantFigureAchievement = i + 1;
							}
					}
			}
			if(indexOfSignificantFigureAchievement > requestedDecimals) {
					let requestedDecimalsToSignificantFiguresDelta = indexOfSignificantFigureAchievement - requestedDecimals;
					dynamicFormat = preDecimalFormat + ".";
					if(postDecimalFormat) {
							dynamicFormat = preDecimalFormat + "." + postDecimalFormat;
					}
					for(let i = 0; i < requestedDecimalsToSignificantFiguresDelta; i++) {
							dynamicFormat = dynamicFormat + "0";
					}
			}
	}
	return dynamicFormat;
}

export const priceFormat = (number: number, decimals = 2, currency = "$", prefix = true) => {
	let decimalString = "";
	for(let i = 0; i < decimals; i++){
			decimalString += "0";
	}
	if (currency.length > 1) {
			prefix = false;
	}
	let format = '0,0.' + decimalString;
	if(number < 10) {
			format = getDynamicFormat(format, number);
	}
	let result = numeral(number).format(format);
	if(result === 'NaN') {
		result = '0.00';
	}
	if (prefix) {
			return `${currency}${'\u00A0'}`+ result;
	} else {
			return result + `${'\u00A0'}${currency}`
	}
}

// Credit for percToColour: https://gist.github.com/mlocati/7210513
export const percToColor = (perc: number) => {
	if(perc > 100){
		perc = 100;
	}
	let r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	let h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}
  
// export function getEtherscanLink(
// 	chainId: string,
// 	data: string,
// 	type: 'transaction' | 'token' | 'address' | 'block'
// ): string {
// 	const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

// 	switch (type) {
// 		case 'transaction': {
// 		return `${prefix}/tx/${data}`
// 		}
// 		case 'token': {
// 		return `${prefix}/token/${data}`
// 		}
// 		case 'block': {
// 		return `${prefix}/block/${data}`
// 		}
// 		case 'address':
// 		default: {
// 		return `${prefix}/address/${data}`
// 		}
// 	}
// }

export const subtractNumbers = (value1: number | string, value2: number | string) => BigNumber(value1).minus(BigNumber(value2)).toString();

export const addNumbers = (value1: number | string, value2: number | string) => BigNumber(value1).plus(BigNumber(value2)).toString();

export const multiplyNumbers = (value1: number | string, value2: number | string) => BigNumber(value1).multipliedBy(BigNumber(value2)).toString();

export const divideNumbers = (value1: number | string, value2: number | string) => BigNumber(value1).dividedBy(BigNumber(value2)).toString();

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const debounce = (
	func: () => void,
	wait: number,
	immediate: boolean
) => {
	// 'private' variable for instance
	// The returned function will be able to reference this due to closure.
	// Each call to the returned function will share this common timer.
	let timeout: NodeJS.Timeout;

	// Calling debounce returns a new anonymous function
	return function() {
		// reference the context and args for the setTimeout function
		// @ts-ignore
		let context = this;
		let args = arguments;

		// Should the function be called now? If immediate is true
		//   and not already in a timeout then the answer is: Yes
		let callNow = immediate && !timeout;

		// This is the basic debounce behaviour where you can call this 
		//   function several times, but it will only execute once 
		//   [before or after imposing a delay]. 
		//   Each time the returned function is called, the timer starts over.
		clearTimeout(timeout);

		// Set the new timeout
		timeout = setTimeout(function() {

			// Inside the timeout function, clear the timeout variable
			// which will let the next execution run when in 'immediate' mode
			// @ts-ignore
			timeout = undefined;

			// Check if the function already ran with the immediate flag
			if (!immediate) {
				// Call the original function with apply
				// apply lets you define the 'this' object as well as the arguments 
				//    (both captured before setTimeout)
				// @ts-ignore
				func.apply(context, args);
			}
		}, wait);

		// Immediate mode and no wait timer? Execute the function..
		// @ts-ignore
		if (callNow) func.apply(context, args);
	}
}

// export const parsePostgresDate = () => {
// 	const parseDate = timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
// 	return 
// }