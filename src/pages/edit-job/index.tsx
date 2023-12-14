import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, TextField } from '@mui/material'
// The URL of the endpoint
import config from 'src/views/dashboard/config.json'

const url = config.apiUrl2

import React, { useState, ChangeEvent, useEffect } from 'react';

import EditSelectedJob from 'src/views/edit-job/EditSelectedJob'

interface Job {
    jobID: number;
    jobName: string;
    targetScans: number;
    minTargetScans: { String: string; Valid: boolean };
  }

  interface JobData {
    jobName: string;
    targetScans: number;
    minTargetScans: { String: string; Valid: boolean };
  }


const Home = () => {

  const [editedJobName, setEditedJobName] = useState('');
  const [editedTargetScans, setEditedTargetScans] = useState<number | string>('');
  const [editedMinTargetScans, setEditedMinTargetScans] = useState<number | string>('');

  const [targetScansError, setTargetScansError] = useState('');
  const [minTargetScansError, setMinTargetScansError] = useState('');

  /* const [jobName, setJobName] = useState<string>('');
  const [targetScans, setTargetScans] = useState<number>(0);
  const [minTargetScans, setMinTargetScans] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>(''); */
  const [jobNameError, setJobNameError] = useState<string>('');
  /* const [showAddJobForm, setShowAddJobForm] = useState<boolean>(true); */
  /* const [selectedValues, setSelectedValues] = useState(""); */

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedJob, setEditedJob] = useState<JobData>({
    jobName: '',
    targetScans: 0,
    minTargetScans: { String: '', Valid: true },
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  
  const [jobData, setJobData] = useState<{ [key: string]: JobData }>({});

  const handleEditInputChange = (jobID: string, field: string, value: string) => {
    setJobData((prevJobData) => ({
      ...prevJobData,
      [jobID]: {
        ...prevJobData[jobID],
        [field]: value,
      },
    }));
  };

  const validateTargetScans = (value: string) => {
    // Your validation logic here
    // Update targetScansError state accordingly
  };
  
  const validateMinTargetScans = (value: string) => {
    // Your validation logic here
    // Update minTargetScansError state accordingly
  };

  /* const handleEditButtonClick = () => {
    setEditMode(!editMode);
  }; */
  const handleEditButtonClick = (jobID: string) => {
    if (editMode === jobID) {
      // If currently in edit mode, update the edited job
      setEditedJob({
        jobName: jobData[jobID]?.jobName || '',
        targetScans: jobData[jobID]?.targetScans as number,
        minTargetScans: jobData[jobID]?.minTargetScans || '',
      });
      handleSaveClick(jobID);
      setEditMode(false);
    } else {
      // Toggle the edit mode
      setEditMode((prevEditMode) => (prevEditMode === jobID ? null : jobID));
    }
  
    

  };


  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch(`${url}/joblist`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error(`Error fetching data:`, error);
      });
  };

  const handleDeleteJob = async (jobID: number) => {
    if (editMode) {
      setEditMode(false);
      
      return;
    }

    const result = window.confirm('Are you sure you want to perform this action?');

    if (result) {
      try {
        // Assuming jobName, targetScans, and minTargetScans are from the state
        const dataToSend = {
          jobName: editedJob.jobName,
          targetScans: editedJob.targetScans,
          minTargetScans: {
            String: editedJob.minTargetScans.String,
            Valid: true,
          },
        };

        const formData = new URLSearchParams();

        Object.entries(dataToSend).forEach(([key, value]) => {
        formData.append(key, value.toString());
        });


        const response = await fetch(`${url}/joblist/${jobID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          alert(`Failed to send data to database. ${response}`);
          return;
        }

        alert('Job deleted successfully.');
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating scans per hour settings.');
      }
    }

    fetchJobs();
  };

  const handleSaveClick = async (jobID: string) => {
    // Do something with the edited values
    console.log('Edited Job ID:', jobID);
    console.log('Edited Job Name:', editedJobName);
    console.log('Edited Target Scans:', editedTargetScans);
    console.log('Edited Min Target Scans:', editedMinTargetScans);
  
    try {
      const dataToSend = {
        jobID: jobID,
        jobName: jobData[jobID]?.jobName || '',
          targetScans: jobData[jobID]?.targetScans as number,
          minTargetScans: {
            String: jobData[jobID]?.minTargetScans || '',
            Valid: true,
          },
        // Add other properties if needed
      };
  
      // Make a PATCH request to your API endpoint for each machine
      const response = await fetch(url + '/joblist/' + jobID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        alert(`Failed to send data to the database. ${response.statusText}`);
        return; // Stop processing if any request fails
      }
      alert('Job updated successfully.');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating scans per hour settings.');
    }
  
    fetchJobs();
  };
  

    return (
        <Grid container spacing={6}>
        <Grid container spacing={6}>
          <div>
            <h2>Edit Parcel Job</h2>
          </div>
          {jobs ? (
            jobs.map((job) => (
              <Grid container spacing={6} key={job.jobID}>
                <Grid item md={12} xs={12}>
                  <Card>
                  <CardContent>
                  <Grid container spacing={6} key={job.jobID}>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        required
                        id="jobName"
                        label="Job Name"
                        value={editMode === job.jobID ? jobData[job.jobID]?.jobName : job.jobName}
                        onChange={(e) => handleEditInputChange(job.jobID.toString(), 'jobName', e.target.value)}
                        error={Boolean(editMode === job.jobID && jobNameError)}
                        helperText={editMode === job.jobID ? jobNameError : ''}
                        disabled={editMode !== job.jobID}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        id="targetScans"
                        label="Target Scans"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        value={editMode === job.jobID ? jobData[job.jobID]?.targetScans : job.targetScans}
                        onChange={(e) => handleEditInputChange(job.jobID.toString(), 'targetScans', e.target.value)}
                        error={Boolean(editMode === job.jobID && targetScansError)}
                        helperText={editMode === job.jobID ? targetScansError : ''}
                        disabled={editMode !== job.jobID}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        id="minTargetScans"
                        label="Min Target Scans"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        value={editMode === job.jobID ? jobData[job.jobID]?.minTargetScans : job.minTargetScans.String}
                        onChange={(e) => handleEditInputChange(job.jobID.toString(), 'minTargetScans', e.target.value)}
                        error={Boolean(editMode === job.jobID && minTargetScansError)}
                        helperText={editMode === job.jobID ? minTargetScansError : ''}
                        disabled={editMode !== job.jobID}
                      />
                    </Grid>


                    <Grid item xs={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            color={editMode === job.jobID ? 'primary':'error'  }
                            variant="contained"
                            onClick={() => handleDeleteJob(job.jobID)}
                            fullWidth
                            /* disabled={editMode === job.jobID} */
                            
                          >
                            {editMode === job.jobID ? 'Cancel':'Delete'  }
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            onClick={() => handleEditButtonClick(job.jobID)}
                            variant="outlined"
                            fullWidth
                            /* disabled={editMode === job.jobID} */
                          >
                            {editMode === job.jobID ? 'Save' : 'Edit'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                  </Card>
                </Grid>
              </Grid>

))
) : (
  <div>No jobs available</div>
)}
</Grid>
</Grid>
    )
}

export default Home