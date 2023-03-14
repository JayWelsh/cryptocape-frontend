import {
  IAddressBundle,
} from '../../interfaces';

interface IManageAddressBundle {
  type: string;
  addressBundle: IAddressBundle;
}

const defaultState: IAddressBundle[] = [];

const addressBundles = (state = defaultState, action: IManageAddressBundle) => {
  switch (action.type) {
      case 'SAVE_ADDRESS_BUNDLE':
          let newState = JSON.parse(JSON.stringify(state));
          return [...newState, action.addressBundle];
      default:
          return state
  }
}

export default addressBundles;