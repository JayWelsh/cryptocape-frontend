import React from 'react';

import NavigationTopBarContainer from '../containers/NavigationTopBarContainer';
import NavigationLeftSideBarContainer from '../containers/NavigationLeftSideBarContainer';
import LoadingProgressContainer from '../containers/LoadingProgressContainer';

type NavigationProps = {
    children: React.ReactNode
}

const Navigation = (props: NavigationProps) => {
    const { children } = props;
    return (
        <>
            <LoadingProgressContainer/>
            <NavigationTopBarContainer/>
            <NavigationLeftSideBarContainer/>
            {children}
        </>
    )
}

export default Navigation