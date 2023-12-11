import React, {useState, useEffect} from 'react';
import config from "../../config";

interface EditSelectedJobProps {
    jobID: number;
    jobName: string;
    targetScans: number;
    minTargetScans: {
      String: string;
      Valid: boolean;
    };
    fetchJobs: () => void;
  }


const EditSelectedJob: React.FC<EditSelectedJobProps> = ({jobID, jobName, targetScans, minTargetScans, fetchJobs}) => {


    const [editedJobName, setEditedJobName] = useState(jobName);
    const [editedTargetScans, setEditedTargetScans] = useState(targetScans);
    const [editedMinTargetScans, setEditedMinTargetScans] = useState(minTargetScans);

    const handleSaveClick =async (jobID: number) => {
        // Do something with the edited values
        console.log('Edited Job ID:', jobID);
        console.log('Edited Job Name:', editedJobName);
        console.log('Edited Target Scans:', editedTargetScans);
        console.log('Edited Min Target Scans:', editedMinTargetScans);

        try {
            const dataToSend = {
                jobID: jobID,
                jobName: editedJobName,
                targetScans: editedTargetScans,
                minTargetScans:{
                  "String": editedMinTargetScans,
                  "Valid": true
              } /* ,
                conveyorID: jobConveyor */
            };
            
            const formData = new URLSearchParams();

                Object.entries(dataToSend).forEach(([key, value]) => {
                formData.append(key, value.toString());
                });
              // Make a PUT request to your API endpoint for each machine
              const response = await fetch('http://' + config.server +'/joblist/' +jobID, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    
                  },
                  body: JSON.stringify(dataToSend),
              });
        
              if (!response.ok) {
                alert(`Failed to send data to database.` + response);
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
        <div className="mb-3" >
                <p><div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Job Name</span>
                  </div>
                  <input
                    className="form-control"
                    placeholder={jobName}
                    value={editedJobName}
                    onChange={(e) => setEditedJobName(e.target.value)}
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
                    placeholder={targetScans.toString()}
                    value={editedTargetScans}
                    onChange={(e) => setEditedTargetScans(parseInt(e.target.value, 10))}
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
                    placeholder={minTargetScans.toString()}
                    value={editedMinTargetScans.String}
                    onChange={(e) => setEditedMinTargetScans({ String: e.target.value.toString(), Valid: true })}
                  />
                </div></p>
                <button className="btn btn-primary" onClick={() => handleSaveClick(jobID)}>
                    Save
                </button>
                
              </div>
    );

}

export default EditSelectedJob;