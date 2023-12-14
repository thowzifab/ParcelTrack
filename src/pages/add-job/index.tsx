// ** React Imports
import React, { useState } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, TextField } from '@mui/material'

// The URL of the endpoint
import config from 'src/views/dashboard/config.json'

const url = config.apiUrl

const Home = () => {
  const [jobName, setJobName] = useState<string>('');
  const [targetScans, setTargetScans] = useState<number | string>('');
  const [minTargetScans, setMinTargetScans] = useState<number | string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [jobNameError, setJobNameError] = useState('');

  const handleTargetScansChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const cleanedValue = stripSpecialCharacters(inputValue);
    setTargetScans(cleanedValue);

    validateInputs(cleanedValue, minTargetScans.toString());
  };

  const handleMinTargetScansChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const cleanedValue = stripSpecialCharacters(inputValue);
    setMinTargetScans(cleanedValue);

    validateInputs(targetScans.toString(), cleanedValue);
  };

  const stripSpecialCharacters = (input: string): string => {
    return input.replace(/[^\d]/gi, ''); // Allow only digits
  };

  const validateInputs = (target: string, minTarget: string) => {
    let newErrorMessage = '';

    if (target.trim() === '') {
      newErrorMessage += 'Target Scans cannot be empty. ';
    }

    if (minTarget.trim() === '') {
      newErrorMessage += 'Min Target Scans cannot be empty. ';
    }

    if (isNaN(Number(target)) || Number(target) < 0) {
      newErrorMessage += 'Invalid input for Target Scans. Please enter a non-negative number. ';
    }

    if (isNaN(Number(minTarget)) || Number(minTarget) < 0) {
      newErrorMessage += 'Invalid input for Min Target Scans. Please enter a non-negative number. ';
    }

    if (Number(minTarget) >= Number(target)) {
      newErrorMessage += 'Min Target Scans must be less than Target Scans. ';
    }

    setErrorMessage(newErrorMessage.trim());
  };

  const handleJobNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    //const cleanedValue = stripSpecialCharacters(inputValue);
    setJobName(inputValue);

    // Validate the input and set the error message
    if (inputValue.trim() === '') {
      setJobNameError('Job name cannot be empty.');
    } else {
      setJobNameError('');
    }
  };
  

  const addJobClick = async () => {
    if (jobNameError || errorMessage) {
      alert('Please fix the errors in the form before proceeding.');
      return;
    }

    try {
      const dataToSend = {
        jobName: jobName,
        targetScans: targetScans,
        minTargetScans: {
          String: minTargetScans,
          Valid: true,
        },
      };

      const formData = new URLSearchParams();

      Object.entries(dataToSend).forEach(([key, value]) => {
        formData.append(key, value.toString());
        });

      const response = await fetch( url + '/joblist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        alert(`Failed to send data to database.`);
        return;
      }
      alert('Job added successfully.');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating scans per hour settings.');
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid container spacing={6}>
        <h2>Add Parcel Job</h2>
      
        <Grid item xs={12}>
          <Card>
              <CardContent>
                
                <div>
                <Grid container spacing={6}>
                  <Grid item xs={3}>
                    <TextField 
                      fullWidth
                      required
                      id="jobName"
                      label="Job Name"
                      value={jobName}
                      onChange={handleJobNameChange}
                      error={Boolean(jobNameError)}
                      helperText={jobNameError}
                    />
                  </Grid>
            
            
                  <Grid item xs={3}>
                    <TextField fullWidth
                      id="targetScans"
                      label="Target Scans"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={targetScans as string}
                      onChange={handleTargetScansChange}
                      
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
                      value={minTargetScans as string}
                      onChange={handleMinTargetScansChange}
                      error={Boolean(errorMessage)}
                      helperText={errorMessage}
                    />
                  </Grid>
                  <Grid item xs={3}>
                      <Button variant='contained' size='large' fullWidth onClick={addJobClick}>
                        Add Job 
                      </Button>
                    </Grid>
                </Grid>
              </div>
          
      
            </CardContent>
          </Card>
          
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Home
