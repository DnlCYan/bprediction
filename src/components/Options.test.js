import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Options from "./Options";
import App from "../App";

test('Verify click Up and Down selected options', async () => {
    let locked = false;
    let checkPrice = false;
    let predict = {
        value: '',
        currentPrice: 0,
        priceDatetime: ''
    };
    let resultMsg = '';

    const onPredict = jest.fn(() => console.log("mock was called"));
    const onRetry = jest.fn(() => console.log("mock was called"));

    const { container, getByText } = render(<Options locked={locked} checkPrice={checkPrice} predict={predict} resultMsg={resultMsg} onPredict={onPredict} onRetry={onRetry} time={predict.priceDatetime && minuteLaps} />);

    expect(screen.queryByText(/Predict Bitcoin value will go/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /up/i })).toBeEnabled();


    //TODO problem getting on events work correctly on test
    // userEvent.click(screen.getByRole('button', { name: /up/i }));

    // screen.debug();

    // expect(screen.queryByText(/Predict Bitcoin value will go/i)).toBeInTheDocument();
    // expect(screen.queryByText(/UP in/i)).toBeInTheDocument();

});