import { connect, ConnectedProps } from 'react-redux';

import { saveAddressBundle } from '../state/actions';

import {
  IAddressBundle,
} from '../interfaces';

import BundleManager from '../components/BundleManager';

interface RootState {
  darkMode: boolean
  isConsideredMobile: boolean
  addressBundles: IAddressBundle[]
}
  
const mapStateToProps = (state: RootState) => ({
  darkMode: state.darkMode,
  isConsideredMobile: state.isConsideredMobile,
  addressBundles: state.addressBundles,
})

const mapDispatchToProps = {
  saveAddressBundle
}

const connector = connect(mapStateToProps, mapDispatchToProps)
  
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(BundleManager)