import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FileCopy from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/History';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FileCopyOutlined from '@mui/icons-material/FileCopyOutlined';
import localForage from 'localforage';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState(null);

  const handleNavigation = (newValue) => {
    if (newValue === 0) {
      navigate("/");
    } else if (newValue === 1) {
      navigate("/history");
    }
  };

  React.useEffect(() => {
    document.title = 'Osta - Home';
  }, []);

  const saveUrl = async (url) => {
    let urls = await localForage.getItem('urls');
    if (!urls) {
      urls = [];
    }
    const date = new Date();
    urls.push({ date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, url });
    await localForage.setItem('urls', urls);
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://osta.onrender.com/upload', formData);
      setDownloadUrl(response.data.download_url);
      saveUrl(response.data.download_url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error in uploading file!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = downloadUrl;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert("URL successfully copied to clipboard!");
      } else {
        throw new Error('Failed to copy text');
      }
    } catch (error) {
      console.error("Failed to copy text: ", error);
      alert("Failed to copy URL!");
    }

    document.body.removeChild(textArea);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <FileCopy sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Osta (Desktop)
            </Typography>
            <FileCopy sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Osta
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      {/* file card */}
      <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
        <Card>
          <CardHeader
            title="Osta Client"
            subheader="Free file upload app"
            titleTypographyProps={{ align: 'center' }}
            subheaderTypographyProps={{ align: 'center' }}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Input
              type="file"
              sx={{ display: 'none' }}
              id="raised-button-file"
              onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Select File
              </Button>
            </label>
            {loading && <CircularProgress sx={{ marginTop: '1rem' }} />}
          </CardContent>
        </Card>
        {downloadUrl &&
          <Paper elevation={3} sx={{ marginTop: '2rem', padding: '1rem' }}>
            <Typography
              variant="body1"
              sx={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
            >
              Download URL: {downloadUrl}
              <IconButton onClick={handleCopy} sx={{ marginLeft: '1rem' }}>
                <FileCopyOutlined />
              </IconButton>
            </Typography>
          </Paper>
        }
      </Container>
      <Box sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0
      }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            handleNavigation(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="History" icon={<Settings />} />
        </BottomNavigation>
      </Box>
    </>
  );
}