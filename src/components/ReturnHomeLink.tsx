import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

import { useNavigate } from "react-router-dom";

const ReturnHomeLink = () => {

  let navigate = useNavigate();

  return (
    <>
        <Typography variant="subtitle2" className="hover-opacity-button flex-center-align" onClick={() => navigate('/')}><ArrowBackIcon style={{marginRight: 6}}/>back home</Typography>
    </>
  );

}

export default ReturnHomeLink;