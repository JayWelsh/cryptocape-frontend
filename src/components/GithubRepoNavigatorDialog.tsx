import * as React from 'react';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PreviewIcon from '@mui/icons-material/Preview';
import { ExternalLink } from '../components/ExternalLink';

interface IGithubRepoNavigatorProps {
  open: boolean;
  onClose: () => void;
}

const RepoEntryContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  marginTop: 0,
}));

const RepoEntrySquareOuter = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '5px',
  paddingTop: '100%',
}));

const RepoEntrySquareInner = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%)translateY(-50%)',
  width: '100%',
  height: '100%',
}));

const RepoEntry = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const GithubRepoNavigatorDialog = (props: IGithubRepoNavigatorProps) => {
  const { onClose, open } = props;

  return (
    <Dialog open={open} onClose={() => onClose()} style={{textAlign: 'center'}} maxWidth="sm" fullWidth sx={{
      root: {
        width: '100%'
      }
    }}>
      <DialogTitle style={{textAlign: 'center'}}>GitHub Repositories</DialogTitle>
      <RepoEntryContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <RepoEntrySquareOuter>
              <RepoEntrySquareInner>
                <ExternalLink href="https://github.com/JayWelsh/cryptocape-frontend">
                  <CardActionArea className="hover-opacity-button full-height hover-border" style={{borderRadius: 8}}>
                    <RepoEntry>
                      <PreviewIcon style={{width: 120, height: 120, marginBottom: 12}}/>
                      <Typography variant="h6">Frontend</Typography>
                    </RepoEntry>
                  </CardActionArea>
                </ExternalLink>
              </RepoEntrySquareInner>
            </RepoEntrySquareOuter>
          </Grid>
          <Grid item xs={12} md={6}>
            <RepoEntrySquareOuter>
              <RepoEntrySquareInner>
                <ExternalLink href="https://github.com/JayWelsh/cryptocape-backend">
                  <CardActionArea className="hover-opacity-button full-height hover-border" style={{borderRadius: 8}}>
                    <RepoEntry>
                      <SettingsSuggestIcon style={{width: 120, height: 120, marginBottom: 12}}/>
                      <Typography variant="h6">Backend</Typography>
                    </RepoEntry>
                  </CardActionArea>
                </ExternalLink>
              </RepoEntrySquareInner>
            </RepoEntrySquareOuter>
          </Grid>
        </Grid>
      </RepoEntryContainer>
    </Dialog>
  );
}

export default GithubRepoNavigatorDialog;