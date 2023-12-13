import { FormControl, RadioGroup, FormControlLabel, Radio, Typography, Button } from "@mui/material"
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

import config from "src/config";

type StatType = string;

interface ChartData {
    id: number;
    datetime: string;
    realDate: string;
    itemCount: number;
    conveyor: string;
    status: string;
  }

const ScanStats: React.FC = () =>  {
    const [statType, setStatType] = useState<StatType>(''); 
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [conveyorValue, setConveyorValue] = useState('mainway');
    const [graphIntervalValue, setGraphIntervalValue] = useState('hourly');
    const [conveyorData, setConveyorData] = useState<any>(null); // Change the type accordingly
    const [graphsLoaded, setGraphsLoaded] = useState<boolean>(false);
    const [xValues, setXValues] = useState<string []>([])
    const [yValues, setYValues] = useState<number[]>([])

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    const handleConveyorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConveyorValue((event.target as HTMLInputElement).value);
    };

    const handleGraphIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGraphIntervalValue((event.target as HTMLInputElement).value);
    };

    const handleLoadGraphs =async () => {
        console.log('Button pressed!');
        await fetchData();
        // Add your logic here
    };

    const filterDataByConveyor = (data: ChartData[] | undefined | null, targetConveyor: string): ChartData[] => {
        if (!data) {
          console.error('Data is undefined or null:', data);
          return [];
        }
      
        // Check if data is an array
        if (Array.isArray(data)) {
            console.log(targetConveyor)
          return data.filter(item => item.conveyor === targetConveyor);
        } else {
          console.error('Data is not an array:', data);
          return [];
        }
      };

    const fetchData = async () => {
        // Use conveyorValue and graphIntervalValue to fetch data from the API
        console.log('Conveyor Value:', conveyorValue);
        console.log('Graph Interval Value:', graphIntervalValue);
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        // Make API request with the selected values...
        try {
            let requestBody: Record<string, any> = {
              type: graphIntervalValue,
            };
      
            // Include startDate and endDate in the requestBody if they are not null
            if (startDate) {
              requestBody.startDate = startDate.toISOString(); // Assuming you need to convert to a string
            }
      
            if (endDate) {
              requestBody.endDate = endDate.toISOString(); // Assuming you need to convert to a string
            }
      
            const response = await fetch(`http://${config.server}/stats`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const data = await response.json();
            const filteredData = filterDataByConveyor(JSON.parse(data), conveyorValue);

            setConveyorData(filteredData);
            const xValues: string[] = filteredData.map((item: { realDate: string }) => item.realDate);
            setXValues(xValues);
            const yValues: number[] = filteredData.map((item: { itemCount: number }) => item.itemCount);
            setYValues(yValues);
            setGraphsLoaded(true);
            console.log('conveyor Data:', conveyorData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }

    };

    const [chartOptions, setChartOptions] = useState<{
        chart: {
          id: string;
        };
        xaxis: {
          categories: string[];
        };
      }>({
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: xValues ?? [],
        },
      });
      
    
      const [chartSeries, setChartSeries] = useState<{
        name: string;
        data: number[];
      }[]>([
        {
          name: "series-1",
          data: yValues ?? [],
        },
      ]);
      
    
      useEffect(() => {
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: {
              ...prevOptions.xaxis,
              categories: xValues!,
            },
          }));
    
          setChartSeries((prevSeries) => [
            {
              ...prevSeries[0],
              data: yValues!,
            },
          ]);
          
      }, [xValues, yValues]);
    return (
        <div>
            <Grid container xs={12} spacing={6}>
                <Grid item md={6} spacing={4} xs={12}> 
                    <Card>
                        <CardContent>
                            <Typography variant="h2" component="div">
                                Conveyor
                            </Typography>
                            <FormControl>
                                {/* <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel> */}
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue="mainway"
                                    
                                    value={conveyorValue}
                                    onChange={handleConveyorChange}
                                >
                                    <FormControlLabel value="Mainway" control={<Radio />} label="Mainway" />
                                    <FormControlLabel value="PB Overhead Scanner" control={<Radio />} label="PB Overhead Scanner" />
                                    <FormControlLabel value="Amazon Overhead Scanner" control={<Radio />} label="Amazon Overhead Scanner" />
                                    
                                </RadioGroup>
                            </FormControl>

                        </CardContent>
                    </Card>
                    
                </Grid>
                <Grid item md={6} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h2" component="div">
                                Graph Interval
                            </Typography>
                            <FormControl>
                                
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue="hourly"
                                    value={graphIntervalValue}
                                    onChange={handleGraphIntervalChange}
                                >
                                    <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
                                    <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                                    <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                                    <FormControlLabel
                                    value="yearly"
                                    control={<Radio />}
                                    label="Yearly"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                        
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h2" component="div">
                                Date Range
                            </Typography>
                            <Grid container xs={12}>
                                <Grid item xs={4}>
                                    <Typography variant="h4" component="div">
                                        Start Date
                                    </Typography>
                                    <ReactDatePicker 
                                        
                                        value={startDate ? startDate.toISOString().split('T')[0] : undefined}
                                        onChange={handleStartDateChange}
                                        
                                        >
                                        </ReactDatePicker>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="h4" component="div">
                                        End Date
                                    </Typography>
                                    <ReactDatePicker 
                                        
                                        value={endDate ? endDate.toISOString().split('T')[0] : undefined}
                                        onChange={handleEndDateChange}
                                        
                                        >
                                        </ReactDatePicker>
                                </Grid>

                                <Grid item xs={4}>
                                    <Button fullWidth variant='contained' size="large" onClick={handleLoadGraphs}>Load Graph</Button>
                                </Grid>

                            </Grid>
                            
                            
                        </CardContent>
                    </Card>
                    
                </Grid>

                <Grid item xs={12} spacing={6}>
                    <Card>
                        <CardContent>
                            <ReactApexcharts
                                options={chartOptions}
                                series={chartSeries}
                                type="line"
                                height={400}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
                
            
        </div>
    )
}

export default ScanStats


