import React from 'react'
import { Line } from 'react-chartjs-2'
import { GraphData } from '../../types'
import { ChartData, ChartOptions } from 'chart.js'
import 'chartjs-adapter-moment'

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Chart with Tick Configuration',
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      ticks: {
        source: 'auto',
        maxRotation: 90,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
}

const LineChart: React.FunctionComponent<GraphData> = ({ labelData, values }) => {
  console.log('Received data')

  console.log('Created data/labels')
  console.log(values)
  console.log(labelData)
  const generateChartData: ChartData<'line'> = {
    labels: labelData,
    datasets: [
      {
        label: 'My First dataset',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <Line data={generateChartData} options={options} />
  )
}

export default LineChart
