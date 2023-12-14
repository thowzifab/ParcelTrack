// ** React Imports
import React, { useState, useEffect } from 'react'

// The URL of the endpoint
import config from 'src/views/dashboard/config.json'

const url = config.apiUrl2

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
import { SyntheticEvent } from 'react-draft-wysiwyg';

function ServerSettings() {
  
  interface Job {
    // Define the structure of your Job object
    // For example:
    jobID: string;
    jobName: string;
    // Add other properties as needed
  }

  interface CurrentJobs {
    machineID: string;
    machineName: string;
    jobID: string;
    jobName: string;
    targetScans: string;
    minTargetScans: { String: string; Valid: boolean } | null;
  }
  const [jobs, setJobs] = useState<Job[] | null>(null);
  
  const fetchJobs = () => {
    
  
    // Empty dependency array to ensure useEffect runs only once on mount
  
    return jobs;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch week numbers from the database
        // Update the jobs state with the fetched data
        const response = await fetch(`${url}/joblist`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(`Error fetching data:`, error);
      }
    };

    fetchData();
  }, []); 
  
  const handleSaveClick = async (machineID: string, event: SyntheticEvent) => {
    const selectedJobID = selectedJobs[machineID];
    console.log('Selected Job ID for machine', machineID, ':', selectedJobID);
  
    if (selectedJobID) {
      const data = {
        machineID: machineID,
        jobID: selectedJobID,
      };
  
      try {
        // Make a POST request to your API endpoint for each machine
        const response = await fetch(`${url}/currentJobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Assuming fetchCurrentJobs is a function that fetches and updates data
        fetchCurrentJobs();
      } catch (error) {
        console.error(`Error during POST request:`, error);
      }
    }
  };

  const [selectedJobs, setSelectedJobs] = useState<{ [key: string]: string }>({}); // State to store selected job IDs

  const handleJobChange = (event: React.ChangeEvent<{ value: unknown }>, machineID: string) => {
    const selectedJobID = event.target.value as string;
    setSelectedJobs((prevSelectedJobs) => ({
      ...prevSelectedJobs,
      [machineID]: selectedJobID,
    }));
  };

  const [currentJobs, setCurrentJobs] = useState<CurrentJobs[]>([]); // Replace YourDataType with the actual type of your data

  const fetchCurrentJobs = async () => {
    try {
      // Fetch week numbers from the database
      // Update the currentJobs state with the fetched data
      const response = await fetch(`${url}/currentJobs`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CurrentJobs[] = await response.json();
      setCurrentJobs(data);
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  

  useEffect(() => {
    fetchCurrentJobs();
    fetchJobs();
  }, []);

  

  return (
    <Grid container spacing={6}>
      <ul>{/* ... (Existing server items) ... */}</ul>

      <Grid container spacing={6}>
        <h2>Scan Per Hour Settings</h2>
        {currentJobs.map(j => {
          return (
            <Grid container spacing={6} key={j.machineID}>
              <Grid item md={12} xs={12}>
                <Card>
                  <CardHeader title={j.machineName} />
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item md={3} xs={12}>
                        <Alert severity='error'>Current Job: {`${j.jobName ? j.jobName : ''}`}</Alert>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Alert severity='info'>Target: {j.targetScans}</Alert>
                      </Grid>

                      <Grid item md={3} xs={12}>
                        <Alert severity='success'>
                          Min Target:{' '}
                          <span className='min-target-scans'>
                            {j.minTargetScans?.String}
                          </span>
                        </Alert>
                      </Grid>

                      <Grid item md={2} xs={12}>
                        <Badge /* badgeContent={targets[index]} */ color='primary'>
                          <CustomTextField
                            fullWidth
                            select
                            defaultValue=''
                            label=''
                            id='custom-select'
                            value={selectedJobs[j.machineID] || ''} // Use the selected job for this row
                            onChange={(e) => handleJobChange(e, j.machineID)}
                          >
                            {jobs ? (jobs.map(j => (
                              <MenuItem key={j.jobID} value={j.jobID}>
                                {j.jobName}
                              </MenuItem>
                            ))):(
                              <MenuItem>No jobs available</MenuItem>
                            )}
                          </CustomTextField>
                        </Badge>
                      </Grid>

                      <Grid item md={1} xs={12}>
                        <Button variant='contained' size='small' onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => handleSaveClick(j.machineID, e)}>
                          Save Settings
                        </Button>
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
      
    </Grid>
  )
}

export default ServerSettings
