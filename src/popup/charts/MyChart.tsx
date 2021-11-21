import React from 'react'
import { useEffect, useState } from 'react'
import { GraphData, Record } from '../../types'
import LineChart from './LineChart'

type Props = {
  // data: Record[]
  // operationFunction: (records: Record[]) => GraphData
  graphData: GraphData,
}

// const ChartTest: React.FunctionComponent<Props> = ({ data, operationFunction }) => {
const ChartTest: React.FunctionComponent<Props> = ({ graphData }) => {

  const [dataForPeriod, setDataForPeriod] = useState<GraphData>()
  const fetchData = async () => {
    console.log('IMPORTANT1')
    // console.log(operationFunction)
    // console.log(data)
    console.log(graphData)
    // console.log(operationFunction(data))
    // setDataForPeriod(operationFunction(data));
    setDataForPeriod(graphData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {dataForPeriod ? (
        <>
          <LineChart
            title={graphData.title}
            labelData={dataForPeriod.labelData}
            values={dataForPeriod.values}
          />
        </>
      ) : (
        'Loading...'
      )}
    </>
  )
}

export default ChartTest
