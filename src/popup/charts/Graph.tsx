import React, {useEffect, useState} from 'react'
import {Database, Record} from '../../model/Database'
import CustomChartTest from './CustomChartTest'
import {container} from '../../inversify/inversify.config'
import {GraphData} from '../../types'
import {TYPES} from '../../inversify/types'
import {TrackedEvent} from '../../model/TrackedEvent'

export default function Graph() {
  // Opened-closed tabs per day
  const openClosed = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      title: 'Opened tabs per day',
      labelData: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(
        ([key, value]) =>
          value.filter((tab: Record) => tab.event === TrackedEvent.TabOpened)
            .length,
      ),
    }
  }
  // Diff
  const diff = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      title: 'Differences of opened and closed tabs',
      labelData: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(
        ([key, value]) =>
          value.filter((tab: Record) => tab.event === TrackedEvent.TabOpened)
            .length -
          value.filter((tab: Record) => tab.event === TrackedEvent.TabClosed)
            .length,
      ),
    }
  }
  // Cumulative sum of opened-closed tabs withing the windows
  const sumSum = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      title: 'Cumulative sum of opened tabs',
      labelData: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate)
        .map(
          ([key, value]) =>
            value.filter((tab: Record) => tab.event === TrackedEvent.TabOpened)
              .length -
            value.filter((tab: Record) => tab.event === TrackedEvent.TabClosed)
              .length,
        )
        .map(
          (
            (sum) => (value: number) =>
              (sum += value)
          )(0),
        ),
    }
  }
  // Total opened tabs
  const tabs = (groupByDate: Map<number, Record[]>): GraphData => {
    return {
      title: 'Total opened tabs',
      labelData: Array.from(groupByDate.keys()),
      values: Array.from(groupByDate).map(
        ([key, value]) =>
          value.reduce((a: Record, b: Record) =>
            a.timestamp > b.timestamp ? a : b,
          ).tabs,
      ),
    }
  }

  const [dataForPeriod, setDataForPeriod] = useState<Map<number, Record[]>>()
  const [graphData, setGraphData] = useState<GraphData>()
  const fetchData = async () => {
    const data = await container
      .get<Database>(TYPES.DatabaseService)
      .query(0, 50621728000000)

    console.log('Queried data')
    console.log(data)

    const groupByDate: Map<number, Record[]> = data.reduce(
      (r: Map<number, Record[]>, a) => {
        // var date = new Date(a.timestamp).toLocaleDateString();
        // var date = moment(new Date(a.timestamp)).startOf('day');
        // var date = a.timestamp;
        const date: number = new Date(a.timestamp).setHours(0, 0, 0, 0)
        r.set(date, [...(r.get(date) || new Array<Record>()), a])
        return r
      },
      new Map<number, Record[]>(),
    )

    setDataForPeriod(groupByDate)
    // setGraphData(identity(data));
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {dataForPeriod ? (
        <>
          <div className="canvas-container">
            <CustomChartTest
              data={dataForPeriod}
              operationFunction={openClosed}
            />
            <CustomChartTest data={dataForPeriod} operationFunction={diff} />
          </div>

          <div className="canvas-container">
            <CustomChartTest data={dataForPeriod} operationFunction={sumSum} />
            <CustomChartTest data={dataForPeriod} operationFunction={tabs} />
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </>
  )
}
