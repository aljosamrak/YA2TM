import React from 'react';
import { useEffect, useState } from 'react';
import { GraphData, Record } from '../types';
import ChartTest from './charts/Chart';
import { query } from '../database/Database'
import CustomChartTest from './charts/CustomChartTest';

export default function Graph() {
  // Opened-closed tabs per day
  let openClosed = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      labels: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(([key, value]) => value.filter((tab: Record) => tab.status === 'open').length)
    }
  }
  // Diff
  let diff = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      labels: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(([key, value]) => value.filter((tab: Record) => tab.status === 'open').length - value.filter((tab: Record) => tab.status === 'closed').length)
    }
  }
  // Cumulative sum of opened-closed tabs withing the windows
  let sumSum = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      labels: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(([key, value]) =>
        value.filter((tab: Record) => tab.status === 'open').length - value.filter((tab: Record) => tab.status === 'closed').length)
        .map((sum => (value: number) => sum += value)(0))
    }
  }
  // Total opened tabs
  let tabs = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      labels: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(([key, value]) => value.reduce((a: Record, b: Record) => a.timestamp > b.timestamp ? a : b).tabs)
    }
  }

  const [dataForPeriod, setDataForPeriod] = useState<Map<number, Record[]>>();
  const [graphData, setGraphData] = useState<GraphData>();
  const fetchData = async () => {
    const data = await query(0, 50621728000000);

    console.log("Queried data");
    console.log(data);

    let groupByDate: Map<number, Record[]> = data.reduce((r: Map<number, Record[]>, a) => {
      // var date = new Date(a.timestamp).toLocaleDateString();
      // var date = moment(new Date(a.timestamp)).startOf('day');
      // var date = a.timestamp;
      var date: number = new Date(a.timestamp).setHours(0, 0, 0, 0);
      r.set(date, [...r.get(date) || new Array<Record>(), a]);
      return r;
    }, new Map<number, Record[]>());

    setDataForPeriod(groupByDate);
    // setGraphData(identity(data));
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      {dataForPeriod ? (
        <>
          <div className="canvas-container">
            <CustomChartTest data={dataForPeriod} operationFunction={openClosed} />
            <CustomChartTest data={dataForPeriod} operationFunction={diff} />
          </div>

          <div className="canvas-container">
            <CustomChartTest data={dataForPeriod} operationFunction={sumSum} />
            <CustomChartTest data={dataForPeriod} operationFunction={tabs} />
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </>
  )
}