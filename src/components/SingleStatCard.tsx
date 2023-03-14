import React from 'react';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

const SingleStatContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
}));

interface ISingleStatCardProps {
  title: string
  subtitle?: string
  value: string | number
  valueTop?: boolean
}

export default function SingleStatCard(props: ISingleStatCardProps) {

  let {
    title,
    subtitle,
    value,
    valueTop = false,
  } = props;

  return (
    <Card className="flex-center-all">
      <SingleStatContent>
        {value && valueTop && <Typography variant="h6" style={{marginBottom: 12}}>{value}</Typography>}
        <Typography variant="h4">{title}</Typography>
        {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
        {value && !valueTop && <Typography variant="h6" style={{marginTop: 12}}>{value}</Typography>}
      </SingleStatContent>
    </Card>
  );
}