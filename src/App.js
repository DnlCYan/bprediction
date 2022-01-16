import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import MarketPrice from './components/MarketPrice'
import Options from './components/Options'
import Balance from './components/Balance'
import Profile from './components/Profile'
import Login from './components/Login'
import UserService from './services/User.service';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';

import './App.css';

import Amplify from '@aws-amplify/core';
import config from './aws-exports';

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

  Amplify.configure(config);
  
  const onPredict = (value) => {
    setLocked(true);
    setPredict({ value: value, currentPrice: marketPrice, priceDatetime: dayjs() });
    setMinuteLaps(TIME_LIMIT);
    setCheckPrice(false);
    setResultMsg('');
  }
  Amplify.configure(config);


  // Update Bitcoin market price
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

  //Predict/Guess Bitcoin price event
  const onPredict = (value) => {
    setLocked(true);
    setPredict({ value: value, currentPrice: marketPrice, priceDatetime: dayjs() });
    setMinuteLaps(TIME_LIMIT);
    setCheckPrice(false);
    setResultMsg('');
  }

  //Retry prediction event
  const onRetry = () => {
    setLocked(false);
    setCheckPrice(false);
    setPredict({ value: '', currentPrice: 0, priceDatetime: '' });
  }

  //Hook to count 60 seconds to check price change
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

  //If right prediction
  const win = () => {
    setPoints(points => parseInt(points) + 1);
    setResultMsg("You win!");
  }

  //If wrong prediction
  const lose = () => {
    setPoints(points => points <= 0 ? 0 : parseInt(points) - 1);
    setResultMsg("You lose!");
  }

  const POINTS_KEY = 'bprediction:points';
  useEffect(() => {
    let localPoints = window.localStorage.getItem(POINTS_KEY);
    setPoints(localPoints ?? 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(POINTS_KEY, points);
    updateUserPoints();
  }, [points]);

  /*Update user points */
  const updateUserPoints = () => {
    //If authenticated
    if(auth){
      const {
        payload: { publicAddress },
      } = jwtDecode(auth.accessToken);
      UserService.updatePoints(publicAddress, parseInt(points));
    }
  }

  /** Login Process */
  const LS_KEY = 'login-with-metamask:auth';
  const [state, setAuth] = useState({});

  useEffect(() => {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    setAuth({ auth });
  }, []);

  const handleLoggedIn = (auth) => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setAuth({ auth });
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setAuth({});
    setPoints(0);
  };

  const onProfileLoad = (user) => {
    setPoints(user.points);
  }

  const { auth } = state;

  return (
    <div className="App">
      <Header />
      <MarketPrice price={marketPrice} lastUpdate={lastUpdateDateTime && lastUpdateDateTime.format(DATE_FORMAT)} previousPrice={previousMarketPrice} onMarketUpdate={onMarketUpdate} />
      <Options locked={locked} checkPrice={checkPrice} predict={predict} resultMsg={resultMsg} onPredict={onPredict} onRetry={onRetry} time={predict.priceDatetime && minuteLaps} />
      <Balance points={points} />
      <div className="App-profile">
        {auth ? (
          <Profile auth={auth} onLoggedOut={handleLoggedOut} onLoad={onProfileLoad}/>
        ) : (
          <Login onLoggedIn={handleLoggedIn} currentPoints={points} />
        )}
      </div>
    </div>
  );
}

export default App;


