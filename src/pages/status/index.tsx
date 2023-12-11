// ** MUI Imports
import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'

const ServerStatus = () => {
  const [serverData, setServerData] = useState({
    Mainway: {
      scanPerHour: 0,
      scannedParcels: 0,
      cbsaCount: 0,
      ogdCount: 0,
      scanPaceStatus: 'Fast', // Default to 'Fast' if not provided by API
    },
    PBOverheadScanner: {
      scanPerHour: 0,
      scannedParcels: 0,
      cbsaCount: 0,
      ogdCount: 0,
      scanPaceStatus: 'Fast', // Default to 'Fast' if not provided by API
    },
    AmazonOverheadScanner: {
      scanPerHour: 0,
      scannedParcels: 0,
      cbsaCount: 0,
      ogdCount: 0,
      scanPaceStatus: 'Fast', // Default to 'Fast' if not provided by API
    },
  });

  useEffect(() => {
    // Fetch data initially
    fetchServerData('Mainway', 'Mainway');
    fetchServerData('PB%20Overhead%20Scanner', 'PBOverheadScanner');
    fetchServerData('Amazon%20Overhead%20Scanner', 'AmazonOverheadScanner');

    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchServerData('Mainway', 'Mainway');
      fetchServerData('PB%20Overhead%20Scanner', 'PBOverheadScanner');
      fetchServerData('Amazon%20Overhead%20Scanner', 'AmazonOverheadScanner');
    }, 5000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const getClassName = (scanPaceStatus: string) => {
    if (scanPaceStatus === 'On Target') {
      return 'blinking-orange';
    } else if (scanPaceStatus === 'Fast') {
      return 'green';
    }
    // Default to 'green' if neither 'On Target' nor 'Fast'
    return 'blinking-red';
  };

  const fetchServerData = (serverName: string, serverKey: string) => {
    fetch(/* `http://192.168.15.80:8080/scannedHourlySinceStart/${serverName}` */`http://127.0.0.1:8080/scannedHourlySinceStart/${serverName}`)
      .then((response) => response.json())
      .then((data) => {
        data = JSON.parse(data);
        setServerData((prevState) => ({
          ...prevState,
          [serverKey]: {
            scanPerHour: data.scan_per_hour,
            scannedParcels: data.total_scanned,
            cbsaCount: data.total_CBSA_hold,
            ogdCount: data.total_OGD_hold,
            scanPaceStatus: data.scan_pace_status,
          },
        }));
      })
      .catch((error) => {
        console.error(`Error fetching ${serverName} data:`, error);
      });
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className={`${getClassName(serverData.Mainway.scanPaceStatus)}`}>
          <CardHeader title='Mainway'></CardHeader>
          <CardContent>
            <Typography gutterBottom variant='body2' component="div">
              {`Current Scan per Hour: ${serverData.Mainway.scanPerHour} | Scanned Parcels: ${serverData.Mainway.scannedParcels} | CBSA Count: ${serverData.Mainway.cbsaCount} | OGD Count: ${serverData.Mainway.ogdCount}`}
            </Typography>
          </CardContent>
        </Card>
        <Card className={`${getClassName(serverData.PBOverheadScanner.scanPaceStatus)}`}>
          <CardHeader title='PB Overhead Scanner'></CardHeader>
          <CardContent>
            <Typography gutterBottom variant='body2' component="div">
              {`Current Scan per Hour: ${serverData.PBOverheadScanner.scanPerHour} | Scanned Parcels: ${serverData.PBOverheadScanner.scannedParcels} | CBSA Count: ${serverData.PBOverheadScanner.cbsaCount} | OGD Count: ${serverData.PBOverheadScanner.ogdCount}`}
            </Typography>
          </CardContent>
        </Card>
        <Card className={`${getClassName(serverData.AmazonOverheadScanner.scanPaceStatus)}`}>
          <CardHeader title='Amazon Overhead Scanner'></CardHeader>
          <CardContent>
            <Typography gutterBottom variant='body2' component="div">
              {`Current Scan per Hour: ${serverData.AmazonOverheadScanner.scanPerHour} | Scanned Parcels: ${serverData.AmazonOverheadScanner.scannedParcels} | CBSA Count: ${serverData.AmazonOverheadScanner.cbsaCount} | OGD Count: ${serverData.AmazonOverheadScanner.ogdCount}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ServerStatus
