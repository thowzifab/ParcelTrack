// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

function ServerSettings() {
  const [scansPerHour, setScansPerHour] = useState({})
  const [isSaveInProgress, setIsSaveInProgress] = useState(false)

  const [machineSettings, setMachineSettings] = useState([
    { machine_id: 1, jobID: 0, targetScans: 0 },
    { machine_id: 2, jobID: 0, targetScans: 0 },
    { machine_id: 3, jobID: 0, targetScans: 0 }
  ])

  const [selectedValues, setSelectedValues] = useState(Array(machineSettings.length).fill(''))
  const [jobs, setJobs] = useState([])

  const [targets, setTargets] = useState(Array(machineSettings.length).fill(''))

  const [current, setCurrent] = useState([])

  const handleJobChange = (index, event) => {
    const selectedValue = event.target.value
    const updatedTargets = [...targets]
    const jobIndex = jobs.findIndex(job => job.jobID === selectedValue)
    updatedTargets[index] = jobs[jobIndex].targetScans
    setTargets(updatedTargets)

    // Ensure that current is initialized as an array
    const updatedValues = Array.isArray(current) ? [...current] : []

    updatedValues[index] = {
      ...updatedValues[index],
      jobID: selectedValue
    }

    setCurrent(updatedValues)
  }

  const fetchJobs = () => {
    // Fetch week numbers from the database
    // Update the weeks state with the fetched data
    fetch('http://192.168.15.75:8080/joblist' /*`http://127.0.0.1:8080/joblist`*/)
      .then(response => response.json())
      .then(data => {
        //data = JSON.parse(data);
        setJobs(data)
      })
      .catch(error => {
        console.error(`Error fetching data:`, error)
      })
  }

  const fetchCurrent = () => {
    fetch('http://192.168.15.75:8080/currentJobs' /* `http://127.0.0.1:8080/currentJobs`*/)
      .then(response => response.json())
      .then(data => {
        setCurrent(data)
      })
      .catch(error => {
        console.error(`Error fetching data:`, error)
      })
  }

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch('http://192.168.15.75:8080/machineSettings' /*'http://127.0.0.1:8080/machineSettings'*/)
      .then(response => response.json())
      .then(data => {
        // Initialize scansPerHour state with default values for all machine IDs
        const scansData = {}
        data.forEach(server => {
          scansData[server.machine_id] = server.target_total_scans
        })
        setScansPerHour(scansData)
        setMachineSettings(data)
      })
      .catch(error => {
        console.error('Error:', error)

        // Handle errors if needed
      })

    fetchJobs()
    fetchCurrent()
  }, [])

  const handleScansPerHourChange = (machineId, value) => {
    setScansPerHour({
      ...scansPerHour,
      [machineId]: parseInt(value, 10) // Convert value to an integer
    })
  }

  const handleSaveClick = async () => {
    try {
      // Loop through machine settings and send PUT requests for each machine
      if (isSaveInProgress) {
        return
      }

      // Set the flag to indicate that save is in progress
      setIsSaveInProgress(true)

      for (const machine of machineSettings) {
        const data = {
          machineID: machine.machine_id,
          jobID: current[machineSettings.indexOf(machine)].jobID
        }

        // Make a PUT request to your API endpoint for each machine
        const response = await fetch('http://192.168.15.75:8080/currentJobs' /* 'http://127.0.0.1:8080/currentJobs'*/, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          alert(`Failed to update server settings for ${machine.name}.`)

          return // Stop processing if any request fails
        }
      }
      alert('Server settings updated successfully.')
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while updating scans per hour settings.')
    }
    fetchCurrent()
    setIsSaveInProgress(false)
  }

  return (
    <Grid container spacing={6}>
      <ul>{/* ... (Existing server items) ... */}</ul>

      <Grid container spacing={6}>
        <h2>Scan Per Hour Settings</h2>
        {machineSettings.map((machine, index) => {
          const currentJob = current?.find(job => job.machineID === machine.machine_id)
          const selectedJob = jobs?.find(j => j.jobID === (currentJob ? currentJob.jobID : ''))

          return (
            <Grid container spacing={6} key={machine.machine_id}>
              <Grid item md={12} xs={12}>
                <Card>
                  <CardHeader title={machine.name} />
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item md={3} xs={12}>
                        <Alert severity='error'>Current Job: {currentJob ? currentJob.jobName : ''}</Alert>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Alert severity='info'>Target: {currentJob ? currentJob.targetScans : ''}</Alert>
                      </Grid>

                      <Grid item md={3} xs={12}>
                        <Alert severity='success'>
                          Min Target:{' '}
                          <span className='min-target-scans'>
                            {currentJob ? currentJob.minTargetScans['String'] : ''}
                          </span>
                        </Alert>
                      </Grid>

                      <Grid item md={3} xs={12}>
                        <Badge badgeContent={targets[index]} color='primary'>
                          <CustomTextField
                            select
                            defaultValue=''
                            label=''
                            id='custom-select'
                            value={selectedJob ? selectedJob.jobID : ''}
                            onChange={e => handleJobChange(index, e)}
                          >
                            {jobs.map(j => (
                              <MenuItem key={j.jobID} value={j.jobID}>
                                {j.jobName}
                              </MenuItem>
                            ))}
                          </CustomTextField>
                        </Badge>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )
        })}
      </Grid>

      {/* Save Button */}
      <Grid item md={3} xs={12}>
        <Button variant='contained' size='large' onClick={handleSaveClick}>
          Save Settings
        </Button>
      </Grid>
    </Grid>
  )
}

export default ServerSettings
