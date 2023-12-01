// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import MainwayTotalScansDaily from 'src/views/dashboard/MainwayTotalScansDaily'

const MainwayTotalScans = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
        <Tab value='1' label='Daily' />
        <Tab value='2' label='Monthly' />
        <Tab value='3' label='Yearly' />
      </TabList>
      <TabPanel value='1'>
        <MainwayTotalScansDaily />
      </TabPanel>
      <TabPanel value='2'>Not Enough Data!</TabPanel>
      <TabPanel value='3'>Not Enough Data!</TabPanel>
    </TabContext>
  )
}

export default MainwayTotalScans
