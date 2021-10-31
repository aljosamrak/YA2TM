import React from 'react'
import { ChartData, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { GraphData } from '../types'
// import styled from "@emotion/styled";
import Chart from 'chart.js'

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        // xAxes: {
        //     display: true,
        //     type: 'time',
        //     time: {
        //         // Luxon format string
        //         // tooltipFormat: 'DD T'
        //         unit: 'day'
        //     },
        //     // title: {
        //     //     display: true,
        //     //     text: 'Date'
        //     // }
        // },
        // yAxes: {
        //     title: {
        //         display: true,
        //         text: 'Value'
        //     }
        // }
    },
}

// const ChartWrapper = styled.div`
//   max-width: 700px;
//   margin: 0 auto;
// `;

const LineChart: React.FunctionComponent<GraphData> = ({ labels, values }) => {
    const generateChartData = () => {
        console.log('Received data')

        console.log('Created data/labels')
        console.log(values)
        console.log(labels)
        return {
            labels,
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
    }

    return (
        // <ChartWrapper>
        // <Line type="line" data={generateChartData()} options={options} />
        <Line data={generateChartData()} options={options} />
        // </ChartWrapper>
    )
}

export default LineChart
