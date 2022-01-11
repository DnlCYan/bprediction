import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import MarketPrice from './components/MarketPrice'
import Options from './components/Options'
import dayjs from 'dayjs';
import './App.css';

const App = () => {
  const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  const TIME_LIMIT = 60;

  
  const [marketPrice, setMarketPrice] = useState(0);
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

  const [timerId, setTimerId] = useState(0);

  const onPredict = (value) => {
    setLocked(true);
    setPredict({ value: value, currentPrice: marketPrice, priceDatetime: dayjs() });
    setMinuteLaps(TIME_LIMIT);
    setCheckPrice(false);
  }

  const onMarketUpdate = (data) => {
    let newMarketPrice = data.data.market_data.price_usd;
    setMarketPrice(newMarketPrice);
    setLastUpdateDateTime(dayjs(data.status.timestamp));

    if (checkPriceRef.current) {
      if (predictRef.current.value === "UP") {
        predictRef.current.currentPrice < newMarketPrice ? win() : lose();
      } else if (predict.value === "DOWN") {
        predictRef.current.currentPrice > newMarketPrice ? win() : lose();
      }
      setLocked(false);
      setCheckPrice(false);
    }
  }

  const lapTime = () => {
    // console.log(this.timerId+" lap1 " +minuteLaps);
    // let n = minuteLaps - 1;
    // console.log(timerId + " lap2 " +n);
    // setMinuteLaps(n);
    minuteLapsRef.current--;
    setMinuteLaps(minuteLapsRef.current);
    // setMinuteLaps(prevMinuteLaps => prevMinuteLaps - 1);

    // console.log(timerId + " lap2 " +(minuteLaps-1));
    if (minuteLapsRef.current <= 0) {
      // if (predict.priceDatetime - lastUpdateDateTime > TIME_LIMIT) {
      setCheckPrice(true);
      // clearInterval(timerId);
      // setTimerId(0);
      // }
    }
  };

  useEffect(() => {

    // if(timerId!=0){
    //   clearInterval(timerId);
    //   setTimerId(0);
    // }

    console.log(timerId + " lap2 " + minuteLaps);
    if (minuteLaps <= 0) {
      // console.log(predict.priceDatetime - lastUpdateDateTime);
      // if (predict.priceDatetime - lastUpdateDateTime > TIME_LIMIT*1000) {
      locked && setCheckPrice(true);
      // clearInterval(timeoutId);
      // clearInterval(timerId);
      // setTimerId(0);
      // }
      return;
    }

    // if(minuteLaps >0){
    //   clearInterval(timerId);
    //   // setTimerId(0);
    // }

    // const intervalId = minuteLaps > 0 && setTimerId(setInterval(lapTime, 1000));
    // const intervalId = minuteLaps > 0 && setTimerId(setInterval(()=>{
    //     setMinuteLaps(prevMinuteLaps => prevMinuteLaps - 1);
    //   }, 1000));
    // setTimerId(intervalId);
    const timeoutId = minuteLaps > 0 && setTimeout(() => {
      setMinuteLaps(prevMinuteLaps => prevMinuteLaps - 1);
    }, 1000);
    console.log(timeoutId + " lap2 " + minuteLaps);

    return () => {
      // clearInterval(intervalId);
      // console.log(timeoutId+" close");
      clearInterval(timeoutId);
      // setTimerId(0);
    }
  }, [minuteLaps]);

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
      <Options locked={locked} checkPrice={checkPrice} predict={predict.value} onPredict={onPredict} time={predict.priceDatetime && minuteLaps} />
    </div>
  );
}

export default App;


