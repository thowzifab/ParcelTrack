import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, TextField } from '@mui/material'
import config from "../../config"
import React, { useState, ChangeEvent, useEffect } from 'react';

import EditSelectedJob from 'src/views/edit-job/EditSelectedJob'

interface Job {
    jobID: number;
    jobName: string;
    targetScans: number;
    minTargetScans: { String: string; Valid: boolean };
  }


const Home = () => {
    const [jobName, setJobName] = useState<string>('');
  const [targetScans, setTargetScans] = useState<number>(0);
  const [minTargetScans, setMinTargetScans] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [jobNameError, setJobNameError] = useState<string>('');
  const [showAddJobForm, setShowAddJobForm] = useState<boolean>(true);
  /* const [selectedValues, setSelectedValues] = useState(""); */

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedJob, setEditedJob] = useState<Job>({
    jobID: null,
    jobName: '',
    targetScans: 0,
    minTargetScans: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);


  const handleEditButtonClick = () => {
    setEditMode(!editMode);
  };

  const handleJobChange = (event: ChangeEvent<HTMLInputElement>) => {
    setJobName(event.target.value);
    setJobNameError('');
  };

  const handleTargetScanChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTargetScans(Number(event.target.value));
    setErrorMessage('');
  };

  const handleMinTargetScanChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMinTargetScans(Number(event.target.value));
    setErrorMessage('');
  };



  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch(`http://${config.server}/joblist`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error(`Error fetching data:`, error);
      });
  };

  const handleDeleteJob = async (jobID: number) => {
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


        const response = await fetch(`http://${config.server}/joblist/${jobID}`, {
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

  const handleEditJob = (jobID: number) => {
    const selectedJob = jobs.find((job) => job.jobID === jobID);

    if (selectedJob) {
      setEditedJob({
        jobID: selectedJob.jobID,
        jobName: selectedJob.jobName,
        targetScans: selectedJob.targetScans,
        minTargetScans: selectedJob.minTargetScans,
      });

      setEditMode(true);
    }
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
                            defaultValue={job.jobName}
                            disabled={!editMode}
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
                            defaultValue={job.targetScans}
                            disabled={!editMode}
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
                            defaultValue={job.minTargetScans.String}
                            disabled={!editMode}
                          />
                        </Grid>
  
                        <Grid item xs={3}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Button
                                color={editMode ?  "primary": "error"}
                                variant="contained"
                                onClick={() => handleDeleteJob(job.jobID)}
                                fullWidth
                              >
                                {editMode ? 'Cancel' : 'Delete'}
                              </Button>
                            </Grid>
                            <Grid item xs={6}>
                              <Button
                                onClick={handleEditButtonClick}
                                variant="outlined"
                                fullWidth
                              >
                                {editMode ? 'Save' : 'Edit'}
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