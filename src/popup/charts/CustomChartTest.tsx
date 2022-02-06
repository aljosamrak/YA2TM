import React from 'react'
import {FunctionComponent, useEffect, useState} from 'react'
import {GraphData} from '../../types'
import {Record} from '../../model/Database'
import LineChart from './LineChart'
import graphStyle from './graph.scss'

interface Props {
  data: Map<number, Record[]>
  operationFunction: (records: Map<number, Record[]>) => GraphData
}

const ChartTest: FunctionComponent<Props> = ({data, operationFunction}) => {
  const [dataForPeriod, setDataForPeriod] = useState<GraphData>()
  const fetchData = async () => {
    console.log('IMPORTANT1')
    console.log(operationFunction)
    console.log(data)
    // console.log(graphData)
    console.log(operationFunction(data))
    setDataForPeriod(operationFunction(data))
    // setDataForPeriod(graphData);
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={graphStyle.graph}>
      {dataForPeriod ? (
        <LineChart
          title={dataForPeriod.title}
          labelData={dataForPeriod.labelData}
          values={dataForPeriod.values}
        />
      ) : (
        'Loading...'
      )}
    </div>
  )
}

export default ChartTest
