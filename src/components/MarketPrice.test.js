import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarketPrice from "./MarketPrice";
import dayjs from 'dayjs';

test('check MarketPrice', async () => {
    const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
    let marketPrice = 5;
    let lastUpdateDateTime = dayjs();
    let previousMarketPrice = 4
    const onMarketUpdate = jest.fn(() => console.log("mock was called"));

    const { container, getByText } = render(<MarketPrice price={marketPrice} lastUpdate={lastUpdateDateTime && lastUpdateDateTime.format(DATE_FORMAT)} previousPrice={previousMarketPrice} onMarketUpdate={onMarketUpdate} />);

    expect(getByText('Market Value: $ '+marketPrice)).toBeInTheDocument();
    expect(getByText('Previous Value: $ '+previousMarketPrice)).toBeInTheDocument();

});