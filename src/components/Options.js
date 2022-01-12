import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Options = ({ locked, checkPrice, predict, predictPrice, onPredict, time }) => {
    return (
        <div className="options">
            <Container>
                {locked && <PredictionSelected checkPrice={checkPrice} predict={predict} predictPrice={predictPrice} time={time} />}
                {!locked && <PredictionOptions onPredict={onPredict} />}
            </Container>
        </div>
    )
}


const PredictionSelected = ({ checkPrice, predict, predictPrice, time }) => {
    return (
        <div className="prediction-selected">
            <h3>Predict Bitcoin value will go {predict} from {predictPrice} in {time}</h3>
            {checkPrice && <h4>Checking next price</h4>}
        </div>
    )
}

const PredictionOptions = ({ onPredict }) => {
    return (
        <div className="prediction-options">
            <Row >
                <Col>
                    <Button as={Col} variant="primary" onClick={() => onPredict("UP")}>UP</Button>
                </Col>
                <Col>
                    <Button as={Col} variant="danger" onClick={() => onPredict("DOWN")}>DOWN</Button>
                </Col>
            </Row>


        </div>
    )
}


export default Options;