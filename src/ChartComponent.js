import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

const data = {
  datasets: [
    {
      label: "Actual",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      lineTension: 0,
      borderDash: [8, 4],
      data: []
    },

    {
        label: "KalmanJS",
        borderColor: "rgb(99, 255, 132)",
        backgroundColor: "rgba(99, 255, 132, 0.5)",
        lineTension: 0,
        borderDash: [8, 4],
        data: []
    },

    {
      label: "Kalman Android",
      borderColor: "rgb(99, 132, 255)",
      backgroundColor: "rgba(99, 132, 255, 0.5)",
      lineTension: 0,
      borderDash: [8, 4],
      data: []
  }
    

  ]
};

const options = {
  scales: {
    xAxes: [
      {
        type: "realtime",
        realtime: {
          delay: 200
        }
      }
    ]
  }
};

export default function ChartComponent(props){
    console.log("Incomming "+props.rssi +" "+props.filtered +" "+props.androidFiltered)
    data.datasets[0].data.push({
        x: Date.now(),
        y: props.rssi
    })

    data.datasets[1].data.push({
        x: Date.now(),
        y: props.filtered
    })

    data.datasets[2].data.push({
      x: Date.now(),
      y: props.androidFiltered
  })


    return (
        <div>
          <Line data={data} options={options} />
        </div>
      );
}
