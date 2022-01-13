import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChartHistory from './ChartHistory';
import dayjs from 'dayjs';

const MarketPrice = ({ price, lastUpdate, previousPrice, onMarketUpdate }) => {
    const REFRESH_TIME = 30000;

    const [isStopped, setIsStopped] = useState(false);
    const refreshIdRef = useRef(0);

    const [marketHistory, setMarketHistory] = useState([]);

    const getPrice = () => {
        axios.get('https://data.messari.io/api/v1/assets/btc/metrics', { "headers": { "x-messari-api-key": "53074b33-87c6-4bbf-b72a-3326910b72e4" } })
            .then(function (response) {
                // handle success
                console.log(response);
                let newMarketPrice = response.data.data.market_data.price_usd;
                let lastUpdateDateTime = dayjs(response.data.status.timestamp);
                onMarketUpdate(newMarketPrice, lastUpdateDateTime);
                setMarketHistory(marketHistory => [...marketHistory, { name: lastUpdateDateTime.format('HH:mm'), value: newMarketPrice }]);
            })
            .catch(function (error) {
                // handle error
                console.log(error);

                clearInterval(refreshIdRef.current);
                refreshIdRef.current = 0;
            })
            .then(function () {
                // always executed
            });
    };

    useEffect(() => {

        if (!isStopped) {
            getPrice();
            refreshIdRef.current = setInterval(getPrice, REFRESH_TIME);
        }
        return () => {
            clearInterval(refreshIdRef.current);
        }
    }, []);

    const start = () => {
        setIsStopped(false);
        getPrice();
        refreshIdRef.current = setInterval(getPrice, REFRESH_TIME);
    }

    const stop = () => {
        setIsStopped(true);
        clearInterval(refreshIdRef.current);
        refreshIdRef.current = 0;
    }

    return (
        <div className="market-price">
            <Container>
                <h2>Market Value: $ {price} {price > previousPrice ? <EvolutionSymbolUp/> : price < previousPrice && <EvolutionSymbolDown/> } </h2>
                <h5>Previous Value: $ {previousPrice}</h5>
                <h4>Last update: {lastUpdate}</h4>
                <Button onClick={() => { isStopped ? start() : stop() }}>{isStopped ? 'START' : 'STOP'} REFRESH</Button>
                <ChartHistory dataArray={marketHistory} />
            </Container>
        </div>
    )
}


const EvolutionSymbolUp = () => {
    return (
        <span role="img" aria-label="up">
            🔼
        </span>
    )
}

const EvolutionSymbolDown = () => {
    return (
        <span role="img" aria-label="up">
            🔻
        </span>
    )
}

export default MarketPrice;
