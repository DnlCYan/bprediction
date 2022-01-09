import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useTimer } from 'react-timer-hook';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MarketPrice = ({ price, lastUpdate, onMarketUpdate }) => {
    const REFRESH_TIME = 30000;

    const [isStopped, setIsStopped] = useState(true);
    const [refreshId, setRefreshId] = useState(0);

    const getPrice = () => {
        axios.get('https://data.messari.io/api/v1/assets/btc/metrics', { "headers": { "x-messari-api-key": "53074b33-87c6-4bbf-b72a-3326910b72e4" } })
            .then(function (response) {
                // handle success
                console.log(response);
                onMarketUpdate(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log("RE" + refreshId);
                console.log(error);

                clearInterval(refreshId);
            })
            .then(function () {
                // always executed
            });
    };

    useEffect(() => {

        if (!isStopped) {
            getPrice();
            setRefreshId(setInterval(getPrice, REFRESH_TIME));
        }
        return () => {
            clearInterval(refreshId);
        }
    }, []);

    const start = () => {
        setIsStopped(false);
        getPrice();
        setRefreshId(setInterval(getPrice, REFRESH_TIME));
    }

    const stop = () => {
        setIsStopped(true);
        clearInterval(refreshId);
    }

    return (
        <div className="market-price">
            <Container>
                <h2>Market Value: $ {price}</h2>
                <h4>Last update: {lastUpdate}</h4>
                <Button onClick={ () => {isStopped ? start() :  stop()}}>{isStopped ? 'START' : 'STOP'} REFRESH</Button>
            </Container>
        </div>
    )
}

export default MarketPrice;