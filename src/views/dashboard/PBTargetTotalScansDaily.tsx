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
const url = 'http://localhost:8080/data'

async function fetchData(): Promise<{ targetTotalScansArray: number[]; timeStringsArray: string[] }> {
  const targetTotalScansArray: number[] = []
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
    const filteredRecords = latestDateRecords.filter((item: any) => item.conveyorBeltName === 'PB Overhead Scanner')

    filteredRecords.forEach((item: any) => {
      const dateTime = new Date(item.currentDate)
      item.sortableTime = dateTime.getHours() * 100 + dateTime.getMinutes()
    })

    filteredRecords.sort((a: any, b: any) => a.sortableTime - b.sortableTime)

    filteredRecords.forEach((item: any) => {
      targetTotalScansArray.push(item.targetTotalScans)

      const dateTime = new Date(item.currentDate)
      const hours = dateTime.getHours()
      const minutes = dateTime.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`

      timeStringsArray.push(timeString)
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return { targetTotalScansArray, timeStringsArray }
}

// Use fetchData to set the series data
fetchData().then(targetTotalScansArray => {
  const series = [
    {
      data: targetTotalScansArray
    }
  ]

  // Now you can use 'series' here
  console.log(series)
})

const PBTargetTotalScansDaily = () => {
  const theme = useTheme()
  const [timeStrings, setTimeStrings] = useState<string[]>([])
  const [targetTotalScans, setTotalScans] = useState<number[]>([])

  useEffect(() => {
    fetchData().then(({ targetTotalScansArray, timeStringsArray }) => {
      setTimeStrings(timeStringsArray)
      setTotalScans(targetTotalScansArray)
    })
  }, [])

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#7367f0'],
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#7367f0'],
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
      data: targetTotalScans
    }
  ]

  return <ReactApexcharts type='line' height={200} options={options} series={series} />
}

export default PBTargetTotalScansDaily
