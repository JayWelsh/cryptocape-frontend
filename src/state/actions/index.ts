import {
    IAddressBundle,
} from '../../interfaces';

export const setShowLeftMenu = (visible: boolean) => ({
    type: "SHOW_LEFT_MENU",
    visible
})

export const setActiveAccount = (account: string) => ({
    type: "SET_ACTIVE_ACCOUNT",
    account
})

export const setDarkMode = (active: boolean) => ({
    type: "SET_DARK_MODE",
    active
})

export const setConsideredMobile = (mobile: boolean) => ({
    type: "IS_CONSIDERED_MOBILE",
    mobile
})

export const saveAddressBundle = (addressBundle: IAddressBundle) => ({
    type: "SAVE_ADDRESS_BUNDLE",
    addressBundle
})