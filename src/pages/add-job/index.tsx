// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, TextField } from '@mui/material'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid container spacing={6}>
        <h2>Add Parcel Job</h2>
      
        <Grid item xs={12}>
          <Card>
              <CardContent>
                
                <div>
                <Grid container spacing={6}>
                  <Grid item xs={4}>
                  <TextField fullWidth
                    required
                    id="jobName"
                    label="Job Name"
                    defaultValue="Job Name"
                  />
                  </Grid>
            
            
                  <Grid item xs={4}>
                    <TextField fullWidth
                      id="targetScans"
                      label="Target Scans"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
            
            
                  <Grid item xs={4}>
                    <TextField  fullWidth
                      id="minTargetScans"
                      label="Min Target Scans"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </div>
          
      
            </CardContent>
          </Card>
          <Grid item md={3} xs={12}>
            <Button variant='contained' size='large' /* onClick={handleSaveClick} */>
              Add Job 
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Home
