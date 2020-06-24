import React from 'react'
import { Line } from "react-chartjs-2";

export default function Chart(props){    
    
    return(
        <div style={{ width: "85%", paddingTop: "2%" }}>
        <Line
          data={{
            labels: props.hdata.map(({ name }) => name),
            datasets: [
              {
                data: props.hdata.map((data) => data.Close),
                label: "BTC-USD",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
              },
            ],
          }}
        />
        </div>
    )
        }