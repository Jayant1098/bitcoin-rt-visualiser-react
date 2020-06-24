import React from 'react'
import { Typography } from "@material-ui/core";

export default function TopBar(props){
    return(
        <div
          style={{
            display: "flex",
            width: "100%",
            "background-color": "#4bc0c0",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="h6" style={{ margin: "0.7% 1%", color: "#FFF" }}>
            Last Price :{" "}
            {props.currentPrice
              ? "$" + props.currentPrice
              : "Fetching Price"}
          </Typography>
        </div>
    )
}