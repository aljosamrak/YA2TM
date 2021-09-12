
window.addEventListener("load", initPopup);



document.addEventListener('DOMContentLoaded', function () {

  document.querySelector('#go-to-options').addEventListener("click", function () {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  var daysLookback = localStorage["days_lookback"];
  if (!daysLookback) {
    daysLookback = 7
  }
  console.log("daysLookback: " + daysLookback);

  var currentTime = Date.now();
  var previousWeekTime = new Date();
  previousWeekTime.setDate(previousWeekTime.getDate() - daysLookback);

  var startTime = previousWeekTime.getTime();
  var endTime = currentTime;

  chrome.storage.local.get(function (items) {
    console.log('Get from storage--------');
    console.log('Start time: ' + startTime);
    console.log('End time:   ' + endTime);
    console.log(items);

    console.log('Tabs count: ' + items.length);
    console.log(typeof items);
    console.log(items);

    var timeFiltered = items.data.filter(tab => tab.timestamp >= startTime && tab.timestamp <= endTime);

    let groupByDate = timeFiltered.reduce((r, a) => {
      // var date = new Date(a.timestamp).toLocaleDateString();
      // var date = moment(new Date(a.timestamp)).startOf('day');
      // var date = a.timestamp;
      var date = new Date(a.timestamp).setHours(0,0,0,0);
      r[date] = [...r[date] || [], a];
      return r;
    }, {});
    console.log(groupByDate);

    var dateLabels = Object.keys(groupByDate);
    console.log("dateLabels");
    console.log(dateLabels);

    var chartOpenCloseCtx = document.getElementById("chartOpenClose").getContext('2d');




    var opened = Object.entries(groupByDate).map(([key, value]) => value.filter(tab => tab.status === 'opened').length);
    console.log("opened");
    console.log(opened);


    // const zip = (a, b) => a.map((k, i) => {
    //   [{timestamp: k, value: b[i]}]
    // });
    // const zip = (a, b) => a.map();
    const zip = (a, b) => a.map((k, i) => ({timestamp: parseInt(k), value: b[i]}));

    var test1 = zip(dateLabels, opened);
    console.log("test1");
    console.log(test1);
    console.log([test1]);
    console.log(new Array(test1));
    console.log(Array.from(test1));
    test1 = Array.from(test1);
    console.log(test1);

    const data1 = {
      // labels: dateLabels,
      datasets: [{
        label: 'My First dataset',
        // fill: false,
        data: test1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
      }]
    };

    var chartOpenClose = new Chart(chartOpenCloseCtx, {
      type: 'line',
      data: data1,

      options: {
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "value"
        },
        scales: {
          x: {
            type: 'time',
            time: {
                // unit: 'day'
            }
          },
          // y: {
          //   beginAtZero: true,
          //   title: {
          //     display: true,
          //     text: 'Value'
          //   }
          // }
        },
      },


    });

    //   type: 'line',

    //   options: {
    //     scales: {
    //       x: {
    //         display: true,
    //         type: 'time',
    //         time: {
    //           // unit: 'month',
    //           tooltipFormat: 'DD T'
    //         },
    //         title: {
    //           display: true,
    //           text: 'Date'
    //         }
    //       },
    //       y: {
    //         title: {
    //           display: true,
    //           text: 'Value'
    //         }

    //       }
    //     }
    //   },



    //   data: {
    //     labels: dateLabels,
    //     datasets: [
    //       {
    //         axis: 'y',
    //         label: '# opened',
    //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //         borderColor: 'rgb(75, 192, 192)',
    //         borderWidth: 1,
    //         data: Object.entries(groupByDate).map(([key, value]) => value.filter(tab => tab.status === 'opened').length),
    //         grouped: false
    //       },
    //       {
    //         axis: 'y',
    //         label: '# closed',
    //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //         borderColor: 'rgb(255, 99, 132)',
    //         borderWidth: 1,
    //         data: Object.entries(groupByDate).map(([key, value]) => value.filter(tab => tab.status === 'closed').length),
    //         grouped: false
    //       },
    //     ],
    //   }
    // });

    // Opened-closed tabs per day
    var data = Object.entries(groupByDate).map(([key, value]) => value.filter(tab => tab.status === 'opened').length - value.filter(tab => tab.status === 'closed').length);
    createBarGraph('Diff', dateLabels, data, "chartDiff");

    // Cumulative sum of opened-closed tabs withing the windows
    const cumulativeSum = (sum => value => sum += value)(0);
    var cumSumData = data.map(cumulativeSum);
    createBarGraph('CumSum', dateLabels, cumSumData, "chartCumSum");

    // Total opened tabs
    var tabs = Object.entries(groupByDate).map(([key, value]) => Math.max.apply(null, value.map(tab => tab.tabs)));
    createBarGraph('Total tabs', dateLabels, tabs, "chartTotal");
  });
});

/** Creates the bar graph */
function createBarGraph(title, yLabels, data, chartElementId) {
  var chartContex = document.getElementById(chartElementId).getContext('2d');

  return new Chart(chartContex, {
    type: 'line',


    options: {
      responsive: true,
      plugins: {
        title: {
          text: title,
          display: true
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          type: 'time',
          time: {
            // Luxon format string
            tooltipFormat: 'DD T'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          }
        }
      },
    },




    data: {
      labels: yLabels,
      datasets: [
        {
          axis: 'y',
          backgroundColor: data.map(val => val > 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
          borderColor: data.map(val => val > 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'),
          minBarLength: 2,
          borderWidth: 1,
          data: data
          // data: [{
          //   x: yLabels,
          //   y: data
          // }]
        },
      ],
    }
  });
}