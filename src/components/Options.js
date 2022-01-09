import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Options = ({locked, predict, onPredict, time}) => {
    

    return (
        <div className="options">
            <Container>
                <Row>
                    <Col>
                        {locked && <h3>Predict Bitcoin value will go {predict}</h3>}
                        {locked && <h4>in {time}</h4>}
                    </Col>
                </Row>
                <Row>
                    {!locked && <Button as={Col} variant="primary" onClick={() => onPredict("UP")}>UP</Button>}
                    {!locked && <Button as={Col} variant="danger" onClick={() => onPredict("DOWN")}>DOWN</Button>}
                </Row>
            </Container>
        </div>
    )
}



export default Options;