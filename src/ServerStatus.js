import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Keyboard as PBOverheadScannerIcon,
  Storage as AmazonOverheadScannerIcon,
} from '@mui/icons-material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import './style.css'; // Import the CSS file

function ServerStatus() {
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

  const fetchServerData = (serverName, serverKey) => {
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

  const getClassName = (scanPaceStatus) => {
    if (scanPaceStatus === 'On Target') {
      return 'blinking-orange';
    } else if (scanPaceStatus === 'Fast') {
      return 'green';
    }
    // Default to 'green' if neither 'On Target' nor 'Fast'
    return 'blinking-red';
  };

  return (
    <div>
      <List component="nav" aria-label="Server Status" className="admin-menu">
        <ListItem button className={getClassName(serverData.Mainway.scanPaceStatus)}>
          <ListItemIcon>
            <PrecisionManufacturingIcon />
          </ListItemIcon>
          <ListItemText
            primary="Mainway"
            secondary={`Current Scan per Hour: ${serverData.Mainway.scanPerHour} | Scanned Parcels: ${serverData.Mainway.scannedParcels} | CBSA Count: ${serverData.Mainway.cbsaCount} | OGD Count: ${serverData.Mainway.ogdCount}`}
          />
        </ListItem>
        <Divider />
        <ListItem button className={getClassName(serverData.PBOverheadScanner.scanPaceStatus)}>
          <ListItemIcon>
            <PBOverheadScannerIcon />
          </ListItemIcon>
          <ListItemText
            primary="PB Overhead Scanner"
            secondary={`Current Scan per Hour: ${serverData.PBOverheadScanner.scanPerHour} | Scanned Parcels: ${serverData.PBOverheadScanner.scannedParcels} | CBSA Count: ${serverData.PBOverheadScanner.cbsaCount} | OGD Count: ${serverData.PBOverheadScanner.ogdCount}`}
          />
        </ListItem>
        <Divider />
        <ListItem button className={getClassName(serverData.AmazonOverheadScanner.scanPaceStatus)}>
          <ListItemIcon>
            <AmazonOverheadScannerIcon />
          </ListItemIcon>
          <ListItemText
            primary="Amazon Overhead Scanner"
            secondary={`Current Scan per Hour: ${serverData.AmazonOverheadScanner.scanPerHour} | Scanned Parcels: ${serverData.AmazonOverheadScanner.scannedParcels} | CBSA Count: ${serverData.AmazonOverheadScanner.cbsaCount} | OGD Count: ${serverData.AmazonOverheadScanner.ogdCount}`}
          />
        </ListItem>
      </List>
    </div>
  );
}

export default ServerStatus;
