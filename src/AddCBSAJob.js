import React, { useEffect, useState } from 'react';

function AddCBSAJob () {
    const [conveyors, setConveyors] = useState([]);
    const [jobName, setJobName] = useState('');
    const [targetScans, setTargetScans] = useState(0);
    const [minTargetScans, setMinTargetScans] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [jobNameError, setJobNameError] = useState('');
    const [showAddJobForm, setShowAddJobForm] = useState(true);
    /* const [jobConveyor, setJobConveyor ] = useState(''); */

    const handleJobChange = (event) => {
        setJobName(event.target.value);
        setJobNameError('');
    };

    const handleTargetScanChange = (event) => {
        setTargetScans(event.target.value);
        setErrorMessage('');
    };

    const handleMinTargetScanChange = (event) => {
      setMinTargetScans(event.target.value);
      setErrorMessage('');
    };

    /* const handleEditJobClick = () => {
      setShowAddJobForm(false);
      //fetchJobs()
    }; */

    /* const fetchJobs = () => {
        
      // Fetch week numbers from the database
      // Update the weeks state with the fetched data
      fetch( /* 'http://192.168.15.80:8080/cbsaJob' `http://127.0.0.1:8080/joblist`)
      .then((response) => response.json())
      .then((data) => {
        //data = JSON.parse(data);
        setJobs(data);
      })
      .catch((error) => {
        console.error(`Error fetching data:`, error);
      });
      
    } */

    const addJobClick = async () => {

      if (jobName.trim() === '') {
        setJobNameError('Job name cannot be empty.');
        return;
      }

      if (isNaN(targetScans) || isNaN(minTargetScans) || parseInt(targetScans, 10) < 0 || parseInt(minTargetScans, 10) < 0 || parseInt(minTargetScans, 10) > parseInt(targetScans,10)) {
        setErrorMessage('Invalid input. Please ensure Input 1 is a non-negative number and Input 2 is less than Input 1.');
        return;
      }
        try {
            const dataToSend = {
                jobName: jobName,
                targetScans: targetScans,
                minTargetScans:{
                  "String": minTargetScans,
                  "Valid": true
              } /* ,
                conveyorID: jobConveyor */
            };
            
            const formData = new URLSearchParams();
            
            for (const key in dataToSend) {
                formData.append(key, dataToSend[key]);
            }
              // Make a PUT request to your API endpoint for each machine
              const response = await fetch('http://127.0.0.1:8080/joblist', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
              });
        
              if (!response.ok) {
                alert(`Failed to send data to database.`);
                return; // Stop processing if any request fails
              }
              alert('Job added successfully.');
            
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating scans per hour settings.');
          }
      };
    
    return(
        <div>
            <h2>{showAddJobForm ? 'Add' : 'Edit'} CBSA Job</h2>

            {showAddJobForm ? (
                <div className="mb-3" >
                <p><div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Job Name</span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Job Name"
                    onChange={handleJobChange}
                    value={jobName}
                  />
                </div></p>
                <p>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Target Scans</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Target # of Scans"
                    onChange={handleTargetScanChange}
                    value={targetScans}
                  />
                </div></p>
                <p>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Minimum Target Scans</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Minimum Target # of Scans"
                    onChange={handleMinTargetScanChange}
                    value={minTargetScans}
                  />
                </div></p>
                
              </div>
            ) : (
              {/* <div className="mb-3" >
              <p><div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Job Name</span>
                </div>
                <select  >
                    {jobs.map(j => (
                      <option key={j.jobID} value={j.jobID}>
                        {j.jobName}
                      </option>
                    ))}
                  </select>
              </div></p>
              <p>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Target Scans</span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Target # of Scans"
                  onChange={handleTargetScanChange}
                  value={targetScans}
                />
              </div></p>
              <p>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Minimum Target Scans</span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Minimum Target # of Scans"
                  onChange={handleMinTargetScanChange}
                  value={minTargetScans}
                />
              </div></p>
              
            </div> */}
            )}

          

          {/* Save Button */}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {jobNameError && <p style={{ color: 'red' }}>{jobNameError}</p>}
            <button className="btn btn-primary" onClick={addJobClick}>
                Add Job
            </button>
            {/* <button className="btn btn-primary" onClick={handleEditJobClick}>
                Edit Job
            </button> */}
        </div>
    );

}
export default AddCBSAJob;