import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Options = ({ locked, checkPrice, predict, predictPrice, resultMsg, onPredict, onRetry, time }) => {
    return (
        <div className="options">
            <Container>
                {locked && <PredictionSelected checkPrice={checkPrice} predict={predict} predictPrice={predictPrice} resultMsg={resultMsg} onRetry={onRetry} time={time} />}
                {!locked && <PredictionOptions onPredict={onPredict} />}
            </Container>
        </div>
    )
}


const PredictionSelected = ({ checkPrice, predict, predictPrice, resultMsg, onRetry, time }) => {
    return (
        <div className="prediction-selected">
            <h3>Predict Bitcoin value will go {predict} from {predictPrice} in {time}</h3>
            {checkPrice && <h4>Checking next price</h4>}
            {resultMsg && <h4>{resultMsg}</h4>}
            {!checkPrice && resultMsg && <Button as={Col} variant="primary" onClick={() => onRetry()}>Retry</Button>}
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