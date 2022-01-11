import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Options = ({ locked, checkPrice, predict, onPredict, time }) => {
    return (
        <div className="options">
            <Container>
                <Row>
                    <Col>
                        {locked && <PredictionSelected checkPrice={checkPrice} predict={predict} time={time}/>}
                    </Col>
                </Row>
                <Row>
                    {!locked && <PredictionOptions onPredict={onPredict} />}
                </Row>
            </Container>
        </div>
    )
}


const PredictionSelected = ({checkPrice, predict, time }) => {
    return (
        <div className="prediction-selected">
            <h3>Predict Bitcoin value will go {predict} in {time}</h3>
            {checkPrice && <h4>Checking next price</h4>}
        </div>
    )
}

const PredictionOptions = ({ onPredict }) => {
    return (
        <div className="prediction-options">
            <Button as={Col} variant="primary" onClick={() => onPredict("UP")}>UP</Button>
            <Button as={Col} variant="danger" onClick={() => onPredict("DOWN")}>DOWN</Button>
        </div>
    )
}


export default Options;