import { connect, ConnectedProps } from 'react-redux';

import { setConsideredMobile } from '../state/actions';

import App from '../components/App';

interface RootState {
    darkMode: boolean
    isConsideredMobile: boolean
}
  
const mapStateToProps = (state: RootState) => ({
    darkMode: state.darkMode,
    isConsideredMobile: state.isConsideredMobile,
})

const mapDispatchToProps = {
    setConsideredMobile
}

const connector = connect(mapStateToProps, mapDispatchToProps)
  
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(App)