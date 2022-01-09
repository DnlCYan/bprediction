import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MarketPrice from './components/MarketPrice'
import Options from './components/Options'
import dayjs from 'dayjs';
import './App.css';

const App = () => {
  const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  const TIME_LIMIT = 60;

  const [marketHistory, setMarketHistory] = useState([]);
  const [marketPrice, setMarketPrice] = useState(0);
  const [lastUpdateDateTime, setLastUpdateDateTime] = useState("");
  const [predictValue, setPredictValue] = useState("");
  const [predictPriceValue, setPredictPriceValue] = useState("");
  const [predictDateTime, setPredictDateTime] = useState("");
  const [minuteLaps, setMinuteLaps] = useState(60);
  const [locked, setLocked] = useState(false);
  const [checkPrice, setCheckPrice] = useState(false);

  const onPredict = (value) => {
    setLocked(true);
    setPredictValue(value);
    setPredictPriceValue(marketPrice);
    setPredictDateTime(dayjs());
    setMinuteLaps(TIME_LIMIT);
    setCheckPrice(false);
  }

  let onMarketUpdate = (data) => {
    setMarketPrice(data.data.market_data.price_usd);
    setMarketHistory(...marketHistory, marketPrice);
    setLastUpdateDateTime(dayjs(data.status.timestamp));
    if (checkPrice) {
      console.log(marketHistory);
      if (predictValue === "UP") {
        predictPriceValue < marketPrice ? win() : lose();
      } else if (predictValue === "DOWN") {
        predictPriceValue > marketPrice ? win() : lose();
      }
      setLocked(false);
    }
  }

  useEffect(() => {
    const lapTime = () => {
      setMinuteLaps(minuteLaps - 1);
      if (minuteLaps <= 0) {
        if (predictDateTime - lastUpdateDateTime > TIME_LIMIT) {
          setCheckPrice(true);
        }
      }
    };

    setInterval(lapTime, 1000);
  }, [predictValue]);

  const win = () => {
    console.log("win");
  }

  const lose = () => {
    console.log("lose");
  }

  return (
    <div className="App">
      <Header />
      <MarketPrice price={marketPrice} lastUpdate={lastUpdateDateTime && lastUpdateDateTime.format(DATE_FORMAT)} onMarketUpdate={onMarketUpdate} />
      <Options locked={locked} predict={predictValue} onPredict={onPredict} time={predictDateTime && setMinuteLaps(minuteLaps - 1)} />
    </div>
  );
}

export default App;

