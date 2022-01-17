import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartHistory from "./ChartHistory";

test('check chart history', async () => {
    let dataArray = [
        {name: '10:10', value:3000},
        {name: '10:11', value:3165},
        {name: '10:12', value:3245},
        {name: '10:13', value:3454},
        {name: '10:14', value:3245},
    ];

    const { container, getByText } = render(<ChartHistory points={dataArray} />);

    //Detect graph?
    // expect(container.querySelector('#root > div > div:nth-child(2)').toBeInTheDocument());

});