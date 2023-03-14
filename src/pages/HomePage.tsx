import React from 'react';

import Container from '@mui/material/Container';

import BundleManagerContainer from '../containers/BundleManagerContainer';

const HomePage = () => {
    return (
        <Container maxWidth="md">
            <BundleManagerContainer/>
        </Container>
    )
};

export default HomePage;