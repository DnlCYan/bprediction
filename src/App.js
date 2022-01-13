import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import MarketPrice from './components/MarketPrice'
import Options from './components/Options'
import Balance from './components/Balance'
import dayjs from 'dayjs';
import './App.css';

const App = () => {
  const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  const TIME_LIMIT = 60;


  const [marketPrice, setMarketPrice] = useState(0);
  const marketPriceRef = useRef(marketPrice);
  marketPriceRef.current = marketPrice;
  const [previousMarketPrice, setPreviousMarketPrice] = useState(0);
  const [lastUpdateDateTime, setLastUpdateDateTime] = useState("");
  const [predict, setPredict] = useState({
    value: '',
    currentPrice: 0,
    priceDatetime: ''
  });
  const predictRef = useRef(predict);
  predictRef.current = predict;
  const [minuteLaps, setMinuteLaps] = useState(0);
  const minuteLapsRef = useRef(minuteLaps);
  minuteLapsRef.current = minuteLaps;
  const [locked, setLocked] = useState(false);
  const [checkPrice, setCheckPrice] = useState(false);
  const checkPriceRef = useRef(checkPrice);
  checkPriceRef.current = checkPrice;
  const [resultMsg, setResultMsg] = useState('');

  const [points, setPoints] = useState(0);
  const pointsRef = useRef(points);
  pointsRef.current = points;

  const [timerId, setTimerId] = useState(0);

  const onPredict = (value) => {
    setLocked(true);
    setPredict({ value: value, currentPrice: marketPrice, priceDatetime: dayjs() });
    setMinuteLaps(TIME_LIMIT);
    setCheckPrice(false);
    setResultMsg('');
  }

  const onMarketUpdate = (newMarketPrice, lastUpdateDateTime) => {
    setPreviousMarketPrice(marketPriceRef.current);
    setMarketPrice(newMarketPrice);
    setLastUpdateDateTime(lastUpdateDateTime);

    if (checkPriceRef.current) {
      if (predictRef.current.value === "UP") {
        predictRef.current.currentPrice < newMarketPrice ? win() : lose();
      } else if (predictRef.current.value === "DOWN") {
        predictRef.current.currentPrice > newMarketPrice ? win() : lose();
      } else {
        console.log("error: missing prediction: " + predictRef.current);
      }

      setCheckPrice(false);
    }
  }

  const onRetry = () => {
    setLocked(false);
    setCheckPrice(false);
    setPredict({ value: '', currentPrice: 0, priceDatetime: '' });
  }


  useEffect(() => {

    if (minuteLaps <= 0) {
      locked && setCheckPrice(true);
      return;
    }
    const timeoutId = minuteLaps > 0 && setTimeout(() => {
      setMinuteLaps(prevMinuteLaps => prevMinuteLaps - 1);
    }, 1000);

    return () => {
      clearInterval(timeoutId);
    }
  }, [minuteLaps]);

  const win = () => {
    setPoints(points => points + 1);
    setResultMsg("You win!");
  }

  const lose = () => {
    setPoints(points => points - 1);
    setResultMsg("You lose!");
  }

  return (
    <div className="App">
      <Header />
      <MarketPrice price={marketPrice} lastUpdate={lastUpdateDateTime && lastUpdateDateTime.format(DATE_FORMAT)} previousPrice={previousMarketPrice} onMarketUpdate={onMarketUpdate} />
      <Options locked={locked} checkPrice={checkPrice} predict={predict.value} predictPrice={predict.currentPrice} resultMsg={resultMsg} onPredict={onPredict} onRetry={onRetry} time={predict.priceDatetime && minuteLaps} />
      <Balance points={points} />
    </div>
  );
}

export default App;


