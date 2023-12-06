import React, { useState, useEffect } from 'react'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// Import the necessary module for making HTTP requests
import fetch from 'node-fetch'

// The URL of the endpoint
import config from 'src/views/dashboard/config.json'

const url = config.apiUrl

async function fetchData(): Promise<{ totalScansArray: number[]; timeStringsArray: string[] }> {
  const totalScansArray: number[] = []
  const timeStringsArray: string[] = []

  try {
    const response = await fetch(url)
    const dataArray = await response.json()

    let latestDate = ''
    dataArray.forEach((item: any) => {
      const currentDate = item.currentDate.split('T')[0]
      if (currentDate > latestDate) {
        latestDate = currentDate
      }
    })

    const latestDateRecords = dataArray.filter((item: any) => item.currentDate.split('T')[0] === latestDate)
    const filteredRecords = latestDateRecords.filter((item: any) => item.conveyorBeltName === 'Mainway')

    filteredRecords.forEach((item: any) => {
      const dateTime = new Date(item.currentDate)
      item.sortableTime = dateTime.getHours() * 100 + dateTime.getMinutes()
    })

    filteredRecords.sort((a: any, b: any) => a.sortableTime - b.sortableTime)

    filteredRecords.forEach((item: any) => {
      totalScansArray.push(item.totalScans)

      const dateTime = new Date(item.currentDate)
      const isoString = dateTime.toISOString()
      const hoursString = isoString.substring(11, 13)
      const minutesString = isoString.substring(14, 16)
      const hours = parseInt(hoursString, 10)
      const minutes = parseInt(minutesString, 10)
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`
      timeStringsArray.push(timeString)
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return { totalScansArray, timeStringsArray }
}

// Use fetchData to set the series data
fetchData().then(totalScansArray => {
  const series = [
    {
      data: totalScansArray
    }
  ]

  // Now you can use 'series' here
  console.log(series)
})

const MainwayTotalScansDaily = () => {
  const theme = useTheme()
  const [timeStrings, setTimeStrings] = useState<string[]>([])
  const [totalScans, setTotalScans] = useState<number[]>([])

  useEffect(() => {
    fetchData().then(({ totalScansArray, timeStringsArray }) => {
      setTimeStrings(timeStringsArray)
      setTotalScans(totalScansArray)
    })
  }, [])

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#019a2c'],
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#019a2c'],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: -10 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      custom(data: any) {
        return `<div class='bar-chart'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
        </div>`
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: timeStrings
    }
  }

  const series = [
    {
      data: totalScans
    }
  ]

  return <ReactApexcharts type='line' height={200} options={options} series={series} />
}

export default MainwayTotalScansDaily
