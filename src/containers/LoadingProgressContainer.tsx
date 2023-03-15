import { connect, ConnectedProps } from 'react-redux';

import LoadingProgress from '../components/LoadingProgress';

interface RootState {
  darkMode: boolean
  isConsideredMobile: boolean
  loadingProgress: number
}
  
const mapStateToProps = (state: RootState) => ({
  darkMode: state.darkMode,
  isConsideredMobile: state.isConsideredMobile,
  loadingProgress: state.loadingProgress,
})

const connector = connect(mapStateToProps, {})
  
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(LoadingProgress)