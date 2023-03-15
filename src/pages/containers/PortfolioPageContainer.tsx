import { connect, ConnectedProps } from 'react-redux';

import { setLoadingProgress } from '../../state/actions';

import PortfolioPage from '../PortfolioPage';

interface RootState {
  darkMode: boolean
  isConsideredMobile: boolean
  isConsideredMedium: boolean
}
  
const mapStateToProps = (state: RootState) => ({
  darkMode: state.darkMode,
  isConsideredMobile: state.isConsideredMobile,
  isConsideredMedium: state.isConsideredMedium,
})

const mapDispatchToProps = {
  setLoadingProgress,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
  
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(PortfolioPage)