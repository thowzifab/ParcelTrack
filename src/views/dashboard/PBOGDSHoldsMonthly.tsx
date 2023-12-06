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

async function fetchData(): Promise<{ ogdsHoldsArray: number[]; daysInMonthArray: string[] }> {
  const ogdsHoldsArray: number[] = []
  const daysInMonthArray: string[] = []

  // Generate a list of all days in the current month
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    daysInMonthArray.push(day.toString()) // Changed to just the day
    ogdsHoldsArray.push(0) // Initialize with 0
  }

  try {
    const response = await fetch(url)
    const dataArray = await response.json()

    dataArray
      .filter((item: any) => item.conveyorBeltName === 'PB Overhead Scanner')
      .forEach((item: any) => {
        const itemDate = new Date(item.currentDate)
        const itemYear = itemDate.getFullYear()
        const itemMonth = itemDate.getMonth()
        const day = itemDate.getDate().toString()

        // Process only if the year and month match the current month
        if (itemYear === year && itemMonth === month) {
          const index = daysInMonthArray.indexOf(day)
          if (index !== -1) {
            ogdsHoldsArray[index] += item.ogdsHolds // Aggregate total scans for each day
          }
        }
      })
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return { ogdsHoldsArray, daysInMonthArray }
}

const PBOGDSHoldsMonthly = () => {
  const theme = useTheme()
  const [daysInMonth, setDaysInMonth] = useState<string[]>([])
  const [ogdsHolds, setTotalScans] = useState<number[]>([])

  useEffect(() => {
    fetchData().then(({ ogdsHoldsArray, daysInMonthArray }) => {
      setDaysInMonth(daysInMonthArray)
      setTotalScans(ogdsHoldsArray)
    })
  }, [])

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#de880c'],
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#de880c'],
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
      categories: daysInMonth
    }
  }

  const series = [
    {
      data: ogdsHolds
    }
  ]

  return <ReactApexcharts type='bar' height={200} options={options} series={series} />
}

export default PBOGDSHoldsMonthly
