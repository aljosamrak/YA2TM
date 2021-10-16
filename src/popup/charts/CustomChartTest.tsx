import React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { GraphData, Record } from '../../types';
import LineChart from '../LineChart'

interface Props {
  data: Map<number, Record[]>
  operationFunction: (records: Map<number, Record[]>) => GraphData
}

const ChartTest: FunctionComponent<Props> = ({ data, operationFunction }) => {

  const [dataForPeriod, setDataForPeriod] = useState<GraphData>();
  const fetchData = async () => {
    console.log("IMPORTANT1")
    console.log(operationFunction)
    console.log(data)
    // console.log(graphData)
    console.log(operationFunction(data))
    setDataForPeriod(operationFunction(data));
    // setDataForPeriod(graphData);
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      {dataForPeriod ? (
        <div>
          <LineChart
            labels={dataForPeriod.labels}
            values={dataForPeriod.values} />
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  )
}

export default ChartTest;