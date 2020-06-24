import React from "react";
import { ButtonGroup, Button } from "@material-ui/core";
import Chart from "./Components/Chart";
import TopBar from './Components/TopBar'
class App extends React.Component {
  state = {
    currentPrice: "",
    timeTicker: true,
    hdata: [],
    view: 1,
  };

  dataa = [];

  // Establish Connection to Web Socket
  ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

  componentDidMount() {
    this.ticker();
    this.fetchHistoricData();
  }

  ticker() {
    this.ws.onopen = () => {
      const subscibe = {
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: [{ name: "ticker" }],
      };
      // console.log("connected");
      this.ws.send(JSON.stringify(subscibe));
    };

    this.ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      this.dataa = message;

      // console.log(message, this.dataa);
    };

    setInterval(
      () =>
        this.setState(({ hdata,timeTicker }) => {
          if(!timeTicker){
            return {currentPrice: this.dataa.price}
          }

          const IsoDate = new Date(this.dataa.time);
          const time = IsoDate.getHours() + ":" + (IsoDate.getMinutes() < 10 ? "0" + IsoDate.getMinutes(): IsoDate.getMinutes());
          const [, ...oldData] = hdata;
          const updatedData = [
            ...oldData,
            { Close: this.dataa.price, name: time },
          ];
          // console.log(updatedData);
          // return { dataFromServer: {Close:this.dataa.price,name: time}}
          return { hdata: updatedData, currentPrice: this.dataa.price };
        }),
      5000
    );
  }

  fetchHistoricData() {
    const today = new Date();

    const fetch24 = () => {
      var yesterdayISO = new Date(today);
      yesterdayISO.setDate(today.getDate() - 1);
      const start = encodeURIComponent(yesterdayISO.toISOString());
      const end = encodeURIComponent(today.toISOString());
      const granularity = 300;
      // console.log(end);
      const url24H = `https://api.pro.coinbase.com/products/BTC-USD/candles?start=${start}&end=${end}&granularity=${granularity}`;

      fetch(url24H)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          const cl = data
            .map((dat) => {
              var date = new Date(dat[0] * 1000);
              const time =
                date.getHours() +
                ":" +
                (date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes());
              // console.log(date, time);
              return { name: time, Close: dat[3] };
              // return {etime:date.getDate().toString() + ' ' + date.getMonth().toString()}
            })
            .reverse();
          this.setState({ hdata: cl });
          // console.log(etime,close)
        });
    };

    const fetchDays = (days) => {
      var threeDayBack = new Date(today);
      threeDayBack.setDate(today.getDate() - days);
      const start = encodeURIComponent(threeDayBack.toISOString());
      const end = encodeURIComponent(today.toISOString());
      const granularity = days > 10 ? 21600 : 3600;
      const url24H = `https://api.pro.coinbase.com/products/BTC-USD/candles?start=${start}&end=${end}&granularity=${granularity}`;
      
      fetch(url24H)
        .then((response) => response.json())
        .then((data) => {
          const cl = data
            .map((dat) => {
              var date = new Date(dat[0] * 1000);
              const time =
                date.getDate() +
                "/" +
                date.getMonth() +
                " " +
                date.getHours() +
                ":" +
                (date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes());
              return { name: time, Close: dat[3] };
              // return {etime:date.getDate().toString() + ' ' + date.getMonth().toString()}
            })
            .reverse();
          this.setState({ hdata: cl });
          // console.log(etime,close)
        });
    };

    const fetchhourly = () => {
      const url24H = `https://api.pro.coinbase.com/products/BTC-USD/candles?granularity=60`;
      fetch(url24H)
        .then((response) => response.json())
        .then((data) => {
          const cl = data
            .map((dat) => {
              var date = new Date(dat[0] * 1000);
              const time =
                date.getHours() +
                ":" +
                (date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes());
              // console.log(date, time);
              return { name: time, Close: dat[3] };
              // return {etime:date.getDate().toString() + ' ' + date.getMonth().toString()}
            })
            .reverse();
          this.setState({ hdata: cl });
          // console.log(etime,close)
        });
    };

    switch (this.state.view) {
      case 24:
        fetch24();
        break;
      case 5:
        fetchDays(5);
        break;
      case 10:
        fetchDays(10);
        break;
      case 1:
        fetchhourly();
        break;
      case 30:
        fetchDays(30);
        break;
      default:
        fetch24();
    }
    // fetchDays(10)
    // console.log(encodeURIComponent(yesterdayISO.toISOString()),'fafsdfasf')
  }

  render() {
    return (
      <div className="App" style={styles.container}>
        <TopBar currentPrice={this.state.currentPrice}/>
        <Chart hdata={this.state.hdata} />
        <div>
          <ButtonGroup color="secondary" aria-label="outlined secondary button group" style={{ margin: "5%" }}>
            <Button onClick={() => this.setState({ view: 30 }, () => this.fetchHistoricData())}>
            30D
            </Button>
            <Button onClick={() => this.setState({ view: 10, timeTicker: false }, () => this.fetchHistoricData())}>
              10D
            </Button>
            <Button onClick={() => this.setState({ view: 5, timeTicker: false }, () => this.fetchHistoricData())}>
              5D
            </Button>
            <Button onClick={() => this.setState({ view: 24, timeTicker: true }, () => this.fetchHistoricData())}>
              1D
            </Button>
            <Button onClick={() => this.setState({ view: 1, timeTicker: true }, () => this.fetchHistoricData())}>
              5hr
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default App;

// 3CVLkyC6ihuBJOo2
//
const styles = {
  paper: {
    color: "#f50057",
    width: "25%",
    padding: "2% 3% 4% 1%",
  },
  container: {
    display: "flex",
    flex: 0.7,
    alignItems: "center",
    "flex-direction": "column",
  },
};
