import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Components Import
import AmazonTotalScans from 'src/views/dashboard/AmazonTotalScans'
import AmazonTargetTotalScans from 'src/views/dashboard/AmazonTargetTotalScans'
import AmazonCBSAHolds from 'src/views/dashboard/AmazonCBSAHolds'
import AmazonOGDSHolds from 'src/views/dashboard/AmazonOGDSHolds'
import MainwayTotalScans from 'src/views/dashboard/MainwayTotalScans'
import MainwayTargetTotalScans from 'src/views/dashboard/MainwayTargetTotalScans'
import MainwayCBSAHolds from 'src/views/dashboard/MainwayCBSAHolds'
import MainwayOGDSHolds from 'src/views/dashboard/MainwayOGDSHolds'
import PBTotalScans from 'src/views/dashboard/PBTotalScans'
import PBTargetTotalScans from 'src/views/dashboard/PBTargetTotalScans'
import PBCBSAHolds from 'src/views/dashboard/PBCBSAHolds'
import PBOGDSHolds from 'src/views/dashboard/PBOGDSHolds'

const Home = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='Switch conveyors'>
        <Tab value='1' label='Amazon Overhead Scanner' />
        <Tab value='2' label='Mainway Scanner' />
        <Tab value='3' label='PB Overhead Scanner' />
      </TabList>
      <TabPanel value='1'>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Total Scans'></CardHeader>
              <CardContent>
                <AmazonTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Target Total Scans'></CardHeader>
              <CardContent>
                <AmazonTargetTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='CBSA Holds'></CardHeader>
              <CardContent>
                <AmazonCBSAHolds />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='OGDS Holds'></CardHeader>
              <CardContent>
                <AmazonOGDSHolds />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value='2'>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Total Scans'></CardHeader>
              <CardContent>
                <MainwayTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Target Total Scans'></CardHeader>
              <CardContent>
                <MainwayTargetTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='CBSA Holds'></CardHeader>
              <CardContent>
                <MainwayCBSAHolds />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='OGDS Holds'></CardHeader>
              <CardContent>
                <MainwayOGDSHolds />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value='3'>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Total Scans'></CardHeader>
              <CardContent>
                <PBTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Target Total Scans'></CardHeader>
              <CardContent>
                <PBTargetTotalScans />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='CBSA Holds'></CardHeader>
              <CardContent>
                <PBCBSAHolds />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='OGDS Holds'></CardHeader>
              <CardContent>
                <PBOGDSHolds />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </TabContext>
  )
}

export default Home
